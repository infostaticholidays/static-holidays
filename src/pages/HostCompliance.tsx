
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const requiredDocs = [
  {
    type: "passport",
    title: "Passport or Driving Licence",
    description: "Upload a clear, readable photo or scan of your ID.",
    category: "Owner verification",
  },
  {
    type: "proof_address",
    title: "Proof of Address",
    description: "A recent document showing your residential address.",
    category: "Owner verification",
  },
  {
    type: "ownership",
    title: "Proof of Ownership",
    description: "Evidence that you own the property or are authorised to let it.",
    category: "Owner verification",
  },
  {
    type: "public_liability",
    title: "Public Liability Insurance (£2m)",
    description: "Upload your current public liability insurance certificate.",
    category: "Insurance",
  },
  {
    type: "holiday_insurance",
    title: "Holiday Let Insurance",
    description: "Upload your holiday property insurance documents.",
    category: "Insurance",
  },
  {
    type: "gas_safety",
    title: "Gas Safety Certificate (CP12)",
    description: "Upload the current gas safety certificate, if applicable.",
    category: "Safety certificates",
  },
  {
    type: "eicr",
    title: "Electrical Installation Condition Report (EICR)",
    description: "Upload your current electrical safety report.",
    category: "Safety certificates",
  },
  {
    type: "pat",
    title: "PAT Testing",
    description: "Upload your portable appliance testing records, where applicable.",
    category: "Safety certificates",
  },
  {
    type: "fire_safety",
    title: "Fire Risk Assessment",
    description: "Upload the relevant fire risk assessment for your property.",
    category: "Safety certificates",
  },
  {
    type: "smoke_alarm",
    title: "Smoke and CO Alarm Evidence",
    description: "Provide evidence of the required smoke and carbon monoxide alarms.",
    category: "Safety certificates",
  },
];

type HostDocument = {
  id: string;
  host_id: string | null;
  document_type: string;
  file_url: string | null;
  status: string | null;
  uploaded_at: string | null;
  reviewed_at: string | null;
  notes: string | null;
};

const green = "#174C3A";
const greenLight = "#E8F3EC";
const ink = "#24352D";
const muted = "#66756D";
const border = "#DCE5DE";

export default function HostCompliance() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<HostDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadData() {
    setLoading(true);
    setPageError("");

    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (profileError || !profileData) {
      setPageError("We couldn't load your host profile. Please try again.");
      setLoading(false);
      return;
    }

    setProfile(profileData);

    const { data: docs, error: docsError } = await supabase
      .from("host_documents")
      .select(
        "id, host_id, document_type, file_url, status, uploaded_at, reviewed_at, notes"
      )
      .eq("host_id", currentUser.id)
      .order("uploaded_at", { ascending: false });

    if (docsError) {
      setPageError("We couldn't load your documents. Please refresh the page.");
      setLoading(false);
      return;
    }

    setDocuments((docs || []) as HostDocument[]);
    setLoading(false);
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function uploadDocument(type: string, file?: File) {
    if (!file || !user || uploadingType) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setPageError("Please choose a PDF, JPG or PNG file.");
      return;
    }

    const maxFileSize = 10 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setPageError("Your file must be 10 MB or smaller.");
      return;
    }

    setUploadingType(type);
    setPageError("");
    setSuccessMessage("");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${user.id}/${type}-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("host-documents")
      .upload(filePath, file);

    if (uploadError) {
      setPageError(`Upload failed: ${uploadError.message}`);
      setUploadingType(null);
      return;
    }

    const { error: insertError } = await supabase
      .from("host_documents")
      .insert({
        host_id: user.id,
        document_type: type,
        file_url: filePath,
        status: "pending",
        notes: null,
      });

    if (insertError) {
      // Clean up the newly uploaded file if its database record failed.
      await supabase.storage.from("host-documents").remove([filePath]);
      setPageError(
        `The file uploaded, but the submission could not be saved: ${insertError.message}`
      );
      setUploadingType(null);
      return;
    }

    const document = requiredDocs.find((item) => item.type === type);

    setSuccessMessage(
      `${document?.title || "Document"} uploaded successfully. It is now awaiting review.`
    );

    await loadData();
    setUploadingType(null);
  }

  // Documents are ordered newest first. Use only the latest submission
  // for each document type when showing the host's current status.
  const latestByType = new Map<string, HostDocument>();

  for (const document of documents) {
    if (!latestByType.has(document.document_type)) {
      latestByType.set(document.document_type, document);
    }
  }

  const uploadedCount = requiredDocs.filter((item) => {
    const doc = latestByType.get(item.type);
    return Boolean(doc?.file_url);
  }).length;

  const approvedCount = requiredDocs.filter((item) => {
    const doc = latestByType.get(item.type);
    return doc?.status?.toLowerCase() === "approved";
  }).length;

  const rejectedCount = requiredDocs.filter((item) => {
    const doc = latestByType.get(item.type);
    return doc?.status?.toLowerCase() === "rejected";
  }).length;

  const uploadProgress = Math.round(
    (uploadedCount / requiredDocs.length) * 100
  );

  const approvalProgress = Math.round(
    (approvedCount / requiredDocs.length) * 100
  );

  const allApproved = approvedCount === requiredDocs.length;

  const groupedDocuments = [
    {
      title: "Owner verification",
      description: "Help us verify your identity and connection to the property.",
      icon: "01",
    },
    {
      title: "Insurance",
      description: "Provide the insurance documents required for your holiday let.",
      icon: "02",
    },
    {
      title: "Safety certificates",
      description: "Keep the relevant property safety records together in one place.",
      icon: "03",
    },
  ];

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingCard}>Loading your Compliance Centre...</div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
          <header style={styles.header}>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 15px",
            marginBottom: 22,
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: 9,
            background: "rgba(255,255,255,0.10)",
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Back to Host Dashboard
        </button>

        <div style={styles.brandRow}>
          <div style={styles.brandMark}>SH</div>
          <div>
            <div style={styles.brandName}>STATIC HOLIDAYS</div>
            <div style={styles.brandSubtitle}>HOST COMPLIANCE CENTRE</div>
          </div>
        </div>

        <div style={styles.headerContent}>
          <span style={styles.eyebrow}>YOUR HOST ACCOUNT</span>
          <h1 style={styles.mainTitle}>
            {profile?.full_name
              ? `Hello, ${profile.full_name}`
              : "Your Compliance Centre"}
          </h1>
          <p style={styles.headerText}>
            Manage your documents, track their progress and see exactly what
            needs your attention.
          </p>
        </div>

        <div style={styles.headerFooter}>
          <span>Secure document submissions</span>
          <span>•</span>
          <span>Clear review updates</span>
        </div>
      </header>

      <div style={styles.content}>
        {pageError && (
          <div role="alert" style={styles.errorBanner}>
            <strong>Something needs attention</strong>
            <p style={styles.bannerText}>{pageError}</p>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => void loadData()}
            >
              Try again
            </button>
          </div>
        )}

        {successMessage && (
          <div role="status" style={styles.successBanner}>
            <div style={styles.successIcon}>✓</div>
            <div>
              <strong>Upload successful</strong>
              <p style={styles.bannerText}>{successMessage}</p>
            </div>
            <button
              type="button"
              style={styles.dismissButton}
              onClick={() => setSuccessMessage("")}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        <section style={styles.sectionIntro}>
          <span style={styles.eyebrow}>YOUR PROGRESS</span>
          <h2 style={styles.sectionTitle}>Your documents at a glance</h2>
          <p style={styles.mutedText}>
            Upload each required document and check its latest review status below.
          </p>
        </section>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Documents uploaded</span>
            <strong style={styles.summaryNumber}>
              {uploadedCount}
              <span style={styles.summaryTotal}> / {requiredDocs.length}</span>
            </strong>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${uploadProgress}%`,
                  background: green,
                }}
              />
            </div>
            <span style={styles.summaryHint}>
              {requiredDocs.length - uploadedCount} still to upload
            </span>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Documents approved</span>
            <strong style={styles.summaryNumber}>
              {approvedCount}
              <span style={styles.summaryTotal}> / {requiredDocs.length}</span>
            </strong>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${approvalProgress}%`,
                  background: "#25804E",
                }}
              />
            </div>
            <span style={styles.summaryHint}>
              {rejectedCount > 0
                ? `${rejectedCount} need${rejectedCount === 1 ? "s" : ""} attention`
                : `${requiredDocs.length - approvedCount} awaiting approval or upload`}
            </span>
          </div>
        </div>

        <section style={styles.overallCard}>
          <div style={styles.overallIcon}>
            {allApproved ? "✓" : rejectedCount > 0 ? "!" : "i"}
          </div>
          <div style={{ flex: 1 }}>
            <strong style={styles.overallTitle}>
              {allApproved
                ? "All required documents approved"
                : rejectedCount > 0
                  ? "Some documents need your attention"
                  : uploadedCount === requiredDocs.length
                    ? "Your documents are being reviewed"
                    : "Complete your document checklist"}
            </strong>
            <p style={styles.overallText}>
              {allApproved
                ? "Your listed documents have been approved. Keep them up to date as needed."
                : rejectedCount > 0
                  ? "Read the feedback on each declined document and upload a corrected replacement."
                  : uploadedCount === requiredDocs.length
                    ? "Thank you. Check back here for updates from the compliance team."
                    : "Upload the remaining documents below. Each item explains what to provide."}
            </p>
          </div>
        </section>

        <section style={styles.checklistSection}>
          <div style={styles.checklistHeading}>
            <div>
              <span style={styles.eyebrow}>DOCUMENT CHECKLIST</span>
              <h2 style={styles.sectionTitle}>What we need from you</h2>
            </div>
            <span style={styles.countPill}>
              {approvedCount} of {requiredDocs.length} approved
            </span>
          </div>

          {groupedDocuments.map((group) => {
            const groupItems = requiredDocs.filter(
              (item) => item.category.toLowerCase() === group.title.toLowerCase()
            );

            return (
              <section key={group.title} style={styles.groupCard}>
                <div style={styles.groupHeader}>
                  <div style={styles.groupNumber}>{group.icon}</div>
                  <div>
                    <h3 style={styles.groupTitle}>{group.title}</h3>
                    <p style={styles.groupDescription}>{group.description}</p>
                  </div>
                </div>

                <div>
                  {groupItems.map((item) => {
                    const existing = latestByType.get(item.type);
                    const status = existing?.status?.toLowerCase() || "missing";
                    const rejected = status === "rejected";
                    const approved = status === "approved";
                    const pending = status === "pending";
                    const busy = uploadingType === item.type;

                    const statusLabel = approved
                      ? "Approved"
                      : rejected
                        ? "Action required"
                        : pending
                          ? "Pending review"
                          : "Not uploaded";

                    const statusStyle = approved
                      ? styles.statusApproved
                      : rejected
                        ? styles.statusRejected
                        : pending
                          ? styles.statusPending
                          : styles.statusMissing;

                    return (
                      <article key={item.type} style={styles.documentRow}>
                        <div style={styles.documentTop}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={styles.documentTitle}>{item.title}</div>
                            <p style={styles.documentDescription}>
                              {item.description}
                            </p>
                          </div>
                          <span style={{ ...styles.statusPill, ...statusStyle }}>
                            {statusLabel}
                          </span>
                        </div>

                        {existing?.uploaded_at && (
                          <p style={styles.uploadedDate}>
                            Latest submission:{" "}
                            {new Date(existing.uploaded_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        )}

                        {rejected && (
                          <div style={styles.rejectionBox}>
                            <strong style={styles.rejectionTitle}>
                              Why was this declined?
                            </strong>
                            <p style={styles.rejectionText}>
                              {existing?.notes?.trim() ||
                                "The compliance team has declined this document. Please contact the team for the reason before uploading a replacement."}
                            </p>
                            <p style={styles.replacementHint}>
                              Please correct the issue described above before
                              uploading a replacement.
                            </p>
                          </div>
                        )}

                        {approved && (
                          <p style={styles.inlineMessage}>
                            ✓ This document has been approved.
                          </p>
                        )}

                        {pending && (
                          <p style={styles.inlineMessage}>
                            Your latest submission is awaiting admin review.
                          </p>
                        )}

                        <div style={styles.uploadActions}>
                          <label
                            style={{
                              ...styles.uploadButton,
                              opacity: busy ? 0.65 : 1,
                              cursor: busy ? "wait" : "pointer",
                            }}
                          >
                            {busy
                              ? "Uploading..."
                              : rejected
                                ? "Upload replacement"
                                : existing?.file_url
                                  ? "Upload new version"
                                  : "Choose document"}
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                              disabled={Boolean(uploadingType)}
                              style={styles.fileInput}
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                  void uploadDocument(item.type, file);
                                }
                                event.currentTarget.value = "";
                              }}
                            />
                          </label>

                          <span style={styles.fileHint}>
                            PDF, JPG or PNG · Max 10 MB
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </section>

        <section style={styles.helpCard}>
          <div style={styles.helpIcon}>?</div>
          <div>
            <h3 style={styles.helpTitle}>Need help with a document?</h3>
            <p style={styles.helpText}>
              If you are unsure what to upload or how to correct a declined
              document, contact the Static Holidays compliance team before
              submitting it again.
            </p>
          </div>
        </section>

        <footer style={styles.footer}>
          <strong>STATIC HOLIDAYS</strong>
          <p>Thank you for helping us maintain a trusted holiday platform.</p>
          <button
            type="button"
            style={styles.refreshButton}
            onClick={() => void loadData()}
          >
            ↻ Refresh document statuses
          </button>
        </footer>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#F5F7F4",
    color: ink,
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    background: green,
    color: "#FFFFFF",
    padding: "28px max(24px, calc((100% - 1040px) / 2)) 26px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    paddingBottom: 25,
    borderBottom: "1px solid rgba(255,255,255,0.18)",
  },
  brandMark: {
    display: "grid",
    placeItems: "center",
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#FFFFFF",
    color: green,
    fontWeight: 800,
    letterSpacing: "-1px",
  },
  brandName: {
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "1.8px",
  },
  brandSubtitle: {
    fontSize: 11,
    letterSpacing: "1.5px",
    color: "#D2E5D9",
    marginTop: 4,
  },
  headerContent: {
    padding: "34px 0 26px",
    maxWidth: 720,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "1.7px",
    color: "#688173",
  },
  mainTitle: {
    fontSize: "clamp(28px, 5vw, 42px)",
    letterSpacing: "-1.3px",
    lineHeight: 1.15,
    margin: "12px 0",
  },
  headerText: {
    color: "#D9E7DE",
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: 600,
    margin: 0,
  },
  headerFooter: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    color: "#D9E7DE",
    fontSize: 12,
  },
  content: {
    maxWidth: 1040,
    margin: "0 auto",
    padding: "32px 20px 48px",
  },
  loadingCard: {
    maxWidth: 600,
    margin: "60px auto",
    padding: 28,
    background: "#FFFFFF",
    border: `1px solid ${border}`,
    borderRadius: 16,
  },
  errorBanner: {
    padding: 18,
    marginBottom: 20,
    border: "1px solid #F0C4C1",
    borderRadius: 12,
    background: "#FFF5F4",
    color: "#922D27",
  },
  successBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: 18,
    marginBottom: 20,
    border: "1px solid #B9DDC6",
    borderRadius: 12,
    background: "#EDF8F0",
    color: "#215D37",
  },
  successIcon: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#D0EBD8",
    fontWeight: 800,
  },
  bannerText: {
    margin: "6px 0 0",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },
  dismissButton: {
    marginLeft: "auto",
    border: 0,
    background: "transparent",
    color: "inherit",
    fontSize: 24,
    cursor: "pointer",
  },
  secondaryButton: {
    marginTop: 12,
    padding: "9px 14px",
    border: `1px solid ${border}`,
    borderRadius: 8,
    background: "#FFFFFF",
    color: ink,
    cursor: "pointer",
    fontWeight: 700,
  },
  sectionIntro: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 25,
    letterSpacing: "-0.6px",
    margin: "8px 0",
  },
  mutedText: {
    color: muted,
    lineHeight: 1.7,
    margin: 0,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
    gap: 16,
    marginBottom: 20,
  },
  summaryCard: {
    background: "#FFFFFF",
    border: `1px solid ${border}`,
    borderRadius: 16,
    padding: 22,
    boxShadow: "0 2px 8px rgba(24,55,38,0.03)",
  },
  summaryLabel: {
    display: "block",
    fontSize: 13,
    color: muted,
    fontWeight: 600,
  },
  summaryNumber: {
    display: "block",
    fontSize: 34,
    letterSpacing: "-1px",
    margin: "8px 0 16px",
  },
  summaryTotal: {
    color: muted,
    fontSize: 19,
    fontWeight: 500,
  },
  progressTrack: {
    height: 8,
    background: "#E8EDE9",
    borderRadius: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 20,
    transition: "width 200ms ease",
  },
  summaryHint: {
    display: "block",
    fontSize: 12,
    color: muted,
    marginTop: 10,
  },
  overallCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: 22,
    border: `1px solid ${border}`,
    borderRadius: 16,
    background: "#FFFFFF",
    marginBottom: 38,
  },
  overallIcon: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: 38,
    height: 38,
    borderRadius: 12,
    background: greenLight,
    color: green,
    fontSize: 19,
    fontWeight: 800,
  },
  overallTitle: {
    display: "block",
    fontSize: 16,
  },
  overallText: {
    margin: "7px 0 0",
    color: muted,
    lineHeight: 1.65,
    fontSize: 14,
  },
  checklistSection: {
    marginBottom: 34,
  },
  checklistHeading: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 22,
  },
  countPill: {
    display: "inline-block",
    borderRadius: 30,
    background: greenLight,
    color: green,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 800,
  },
  groupCard: {
    background: "#FFFFFF",
    border: `1px solid ${border}`,
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
  },
  groupHeader: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 22,
    background: "#FBFCFA",
    borderBottom: `1px solid ${border}`,
  },
  groupNumber: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: 42,
    height: 42,
    borderRadius: 12,
    background: greenLight,
    color: green,
    fontWeight: 800,
    fontSize: 13,
  },
  groupTitle: {
    fontSize: 18,
    margin: 0,
  },
  groupDescription: {
    color: muted,
    fontSize: 13,
    lineHeight: 1.5,
    margin: "5px 0 0",
  },
  documentRow: {
    padding: "22px",
    borderBottom: `1px solid ${border}`,
  },
  documentTop: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: 750,
    lineHeight: 1.5,
  },
  documentDescription: {
    color: muted,
    fontSize: 13,
    lineHeight: 1.65,
    margin: "5px 0 0",
  },
  statusPill: {
    display: "inline-block",
    flexShrink: 0,
    borderRadius: 30,
    padding: "6px 10px",
    fontSize: 11,
    fontWeight: 800,
  },
  statusApproved: {
    background: "#E4F5E9",
    color: "#216B3A",
  },
  statusRejected: {
    background: "#FCE9E7",
    color: "#A52C25",
  },
  statusPending: {
    background: "#FFF2D8",
    color: "#8B5A0A",
  },
  statusMissing: {
    background: "#EDF0ED",
    color: "#59675F",
  },
  uploadedDate: {
    color: muted,
    fontSize: 12,
    margin: "12px 0 0",
  },
  rejectionBox: {
    marginTop: 16,
    padding: 16,
    border: "1px solid #F0C7C3",
    borderRadius: 10,
    background: "#FFF6F5",
  },
  rejectionTitle: {
    color: "#A52C25",
    fontSize: 13,
  },
  rejectionText: {
    color: "#7F2924",
    fontSize: 14,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    margin: "8px 0",
  },
  replacementHint: {
    color: "#7F2924",
    fontSize: 12,
    lineHeight: 1.6,
    margin: 0,
  },
  inlineMessage: {
    color: "#37694A",
    fontSize: 12,
    lineHeight: 1.6,
    margin: "12px 0 0",
  },
  uploadActions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: green,
    color: "#FFFFFF",
    borderRadius: 9,
    padding: "11px 15px",
    fontSize: 13,
    fontWeight: 750,
    lineHeight: 1.4,
  },
  fileInput: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
  fileHint: {
    color: muted,
    fontSize: 11,
  },
  helpCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: 22,
    borderRadius: 16,
    border: "1px solid #C9DDD0",
    background: "#EDF5EF",
    marginBottom: 36,
  },
  helpIcon: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#D7E9DC",
    color: green,
    fontWeight: 800,
  },
  helpTitle: {
    fontSize: 15,
    margin: "2px 0 7px",
  },
  helpText: {
    color: "#52675A",
    fontSize: 13,
    lineHeight: 1.7,
    margin: 0,
  },
  footer: {
    textAlign: "center",
    borderTop: `1px solid ${border}`,
    paddingTop: 26,
    color: muted,
    fontSize: 12,
    lineHeight: 1.7,
  },
  refreshButton: {
    marginTop: 8,
    padding: "10px 14px",
    border: `1px solid ${border}`,
    borderRadius: 8,
    background: "#FFFFFF",
    color: green,
    fontWeight: 700,
    cursor: "pointer",
  },
};
