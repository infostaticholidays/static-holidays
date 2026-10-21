
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type GuestDocument = {
  id: string;
  user_id: string;
  document_path: string;
  status: string;
  submitted_at: string;
  reviewer_notes: string | null;
};

type HostDocument = {
  id: string;
  host_id: string;
  document_type: string;
  file_url: string | null;
  status: string | null;
  uploaded_at: string | null;
  expiry_date: string | null;
  notes: string | null;
};

type Section = "guests" | "hosts";

export default function AdminDocumentReview() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [section, setSection] = useState<Section>("guests");
  const [guestDocs, setGuestDocs] = useState<GuestDocument[]>([]);
  const [hostDocs, setHostDocs] = useState<HostDocument[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loadingDocs, setLoadingDocs] = useState(false);

  const loadDocuments = useCallback(async () => {
    setLoadingDocs(true);
    setError("");

    const [guests, hosts] = await Promise.all([
      supabase
        .from("identity_verifications")
        .select(
          "id, user_id, document_path, status, submitted_at, reviewer_notes"
        )
        .eq("status", "pending")
        .order("submitted_at", { ascending: true }),

      supabase
        .from("host_documents")
        .select(
          "id, host_id, document_type, file_url, status, uploaded_at, expiry_date, notes"
        )
        .eq("status", "pending")
        .order("uploaded_at", { ascending: true }),
    ]);

    if (guests.error || hosts.error) {
      setError(
        guests.error?.message ||
          hosts.error?.message ||
          "Could not load documents."
      );
    } else {
      setGuestDocs((guests.data || []) as GuestDocument[]);
      setHostDocs((hosts.data || []) as HostDocument[]);
    }

    setLoadingDocs(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialise() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (authError || !user) {
          navigate("/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (cancelled) return;

        if (profileError || profile?.role !== "admin") {
          setError("Administrator access is required.");
          setChecking(false);
          return;
        }

        setIsAdmin(true);
        await loadDocuments();

        if (!cancelled) setChecking(false);
      } catch {
        if (!cancelled) {
          setError("Could not verify administrator access. Please try again.");
          setChecking(false);
        }
      }
    }

    initialise();

    return () => {
      cancelled = true;
    };
  }, [navigate, loadDocuments]);

  async function openPrivateFile(bucket: string, path: string) {
    setError("");

    const newWindow = window.open("about:blank", "_blank");

    if (newWindow) {
      newWindow.opener = null;
      newWindow.document.title = "Opening secure document";
      newWindow.document.body.innerText = "Loading secure document...";
    }

    const { data, error: fileError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60);

    if (fileError || !data?.signedUrl) {
      newWindow?.close();
      setError(
        fileError?.message ||
          "Could not open the document. Please check your access."
      );
      return;
    }

    if (newWindow) {
      newWindow.location.href = data.signedUrl;
    } else {
      setError("Your browser blocked the document window. Please allow pop-ups and try again.");
    }
  }

  async function reviewGuest(
    doc: GuestDocument,
    decision: "approved" | "rejected"
  ) {
    const notes = window.prompt(
      decision === "approved"
        ? "Optional review notes:"
        : "Please enter the reason for rejecting this ID:"
    );

    if (notes === null) return;

    if (decision === "rejected" && !notes.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }

    setBusyId(doc.id);
    setError("");
    setMessage("");

    try {
      const { error: reviewError } = await supabase.rpc(
        "review_identity_verification",
        {
          p_verification_id: doc.id,
          p_decision: decision,
          p_reviewer_notes: notes,
        }
      );

      if (reviewError) {
        setError(reviewError.message);
      } else {
        setMessage(`Guest ID ${decision}.`);
        await loadDocuments();
      }
    } catch {
      setError("The review could not be completed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function reviewHost(
    doc: HostDocument,
    decision: "approved" | "rejected"
  ) {
    const notes = window.prompt(
      decision === "approved"
        ? "Optional review notes:"
        : "Please enter the reason for rejecting this document:"
    );

    if (notes === null) return;

    if (decision === "rejected" && !notes.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }

    setBusyId(doc.id);
    setError("");
    setMessage("");

    try {
      const { error: reviewError } = await supabase.rpc(
        "review_host_document",
        {
          p_document_id: doc.id,
          p_decision: decision,
          p_notes: notes,
        }
      );

      if (reviewError) {
        setError(reviewError.message);
      } else {
        setMessage(`Host document ${decision}.`);
        await loadDocuments();
      }
    } catch {
      setError("The review could not be completed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  const dateLabel = (value: string | null | undefined) => {
    if (!value) return "Not provided";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "Not provided"
      : date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  if (checking) {
    return (
      <main className="admin-page">
        <p className="admin-loading">Checking administrator access...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <div className="admin-denied">
          <h1>Access denied</h1>
          <p>{error || "Administrator access is required."}</p>
          <Link to="/">Return home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <style>{`
        .admin-page {
          min-height: 100vh;
          background: #f5f7f6;
          color: #20312c;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 0 0 48px;
        }
        .admin-page * { box-sizing: border-box; }
        .admin-wrap { width: min(1120px, calc(100% - 36px)); margin: 0 auto; }
        .admin-topbar { background: #173d35; color: white; padding: 22px 0; }
        .admin-brand { display: flex; align-items: center; gap: 13px; }
        .admin-brand-mark {
          display: grid; place-items: center; width: 44px; height: 44px;
          border: 1px solid #70948a; border-radius: 13px; font-size: 23px;
        }
        .admin-brand-name { font-size: 19px; font-weight: 750; letter-spacing: -.4px; }
        .admin-brand-sub { margin-top: 4px; font-size: 12px; color: #d2e2dc; }
        .admin-pill {
          margin-left: auto; border: 1px solid #77978d; color: #f0f7f3;
          border-radius: 999px; padding: 7px 12px; font-size: 12px; font-weight: 650;
        }
        .admin-main { padding-top: 34px; }
        .admin-heading-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
        .admin-eyebrow { color: #55776b; font-size: 12px; font-weight: 750; text-transform: uppercase; letter-spacing: 1.3px; }
        .admin-title { font-size: clamp(27px, 4vw, 35px); letter-spacing: -1.2px; margin: 8px 0; }
        .admin-description { color: #687a73; margin: 0; line-height: 1.6; }
        .admin-button {
          border: 1px solid #d5e0da; background: white; color: #29443a;
          padding: 10px 15px; border-radius: 10px; font-size: 13px; font-weight: 650;
          cursor: pointer; transition: background .15s ease;
        }
        .admin-button:hover { background: #edf4ef; }
        .admin-button:disabled { opacity: .55; cursor: wait; }
        .admin-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin: 28px 0; }
        .admin-stat { background: white; border: 1px solid #e0e8e3; border-radius: 16px; padding: 20px; }
        .admin-stat-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #687a73; font-size: 13px; }
        .admin-stat-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; background: #edf4ef; font-size: 19px; }
        .admin-stat-number { font-size: 31px; font-weight: 750; letter-spacing: -1px; margin-top: 14px; }
        .admin-stat-caption { color: #7a8a83; font-size: 12px; margin-top: 3px; }
        .admin-panel { background: white; border: 1px solid #e0e8e3; border-radius: 17px; overflow: hidden; }
        .admin-panel-head { padding: 22px 24px 0; }
        .admin-panel-title { font-size: 19px; font-weight: 750; margin: 0; }
        .admin-panel-subtitle { font-size: 13px; color: #77867f; margin: 7px 0 20px; line-height: 1.5; }
        .admin-tabs { display: flex; gap: 8px; padding: 0 24px; border-bottom: 1px solid #e7ede9; }
        .admin-tab { border: 0; background: transparent; padding: 13px 15px; cursor: pointer; color: #718078; font-size: 13px; font-weight: 700; border-bottom: 3px solid transparent; }
        .admin-tab.active { color: #1b5a48; border-bottom-color: #26745b; }
        .admin-tab-count { display: inline-block; margin-left: 7px; padding: 3px 7px; background: #edf4ef; color: #315f4d; border-radius: 7px; font-size: 11px; }
        .admin-content { padding: 22px 24px; }
        .admin-section-heading { font-size: 14px; font-weight: 750; margin: 0 0 16px; }
        .admin-doc-card { border: 1px solid #e0e8e3; border-radius: 14px; padding: 19px; margin-bottom: 14px; }
        .admin-doc-header { display: flex; align-items: flex-start; gap: 12px; }
        .admin-doc-icon { flex-shrink: 0; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 12px; background: #edf4ef; font-size: 20px; }
        .admin-doc-info { flex: 1; min-width: 0; }
        .admin-doc-title { margin: 2px 0 6px; font-size: 15px; font-weight: 750; overflow-wrap: anywhere; }
        .admin-doc-subtitle { color: #7b8982; font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
        .admin-status { flex-shrink: 0; padding: 6px 9px; border-radius: 999px; background: #fff5df; color: #926018; font-size: 11px; font-weight: 750; }
        .admin-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; background: #f7f9f7; padding: 14px; border-radius: 10px; margin: 17px 0; }
        .admin-detail-label { color: #7b8982; font-size: 11px; margin-bottom: 5px; }
        .admin-detail-value { font-size: 12px; color: #344a40; overflow-wrap: anywhere; }
        .admin-note { font-size: 12px; color: #687a73; line-height: 1.6; margin: 0 0 14px; overflow-wrap: anywhere; }
        .admin-actions { display: flex; flex-wrap: wrap; gap: 9px; }
        .admin-view { background: #edf4ef; border-color: #d4e5d9; color: #245841; }
        .admin-approve { background: #23664f; color: white; border-color: #23664f; }
        .admin-approve:hover { background: #194e3c; }
        .admin-reject { background: white; color: #a33e3e; border-color: #e7caca; }
        .admin-reject:hover { background: #fff4f4; }
        .admin-alert { border-radius: 10px; padding: 13px 15px; font-size: 13px; line-height: 1.5; margin: 0 0 18px; overflow-wrap: anywhere; }
        .admin-alert.error { background: #fff0f0; color: #a52e2e; border: 1px solid #f0d0d0; }
        .admin-alert.success { background: #eaf7ee; color: #256344; border: 1px solid #cce8d5; }
        .admin-empty { text-align: center; padding: 38px 15px; color: #718078; }
        .admin-empty-icon { font-size: 30px; margin-bottom: 10px; }
        .admin-empty-title { color: #314b40; font-size: 15px; font-weight: 750; margin-bottom: 6px; }
        .admin-footer { text-align: center; padding-top: 25px; font-size: 12px; color: #7a8982; }
        .admin-footer a { color: #356c55; text-decoration: none; font-weight: 650; }
        .admin-loading, .admin-denied { max-width: 700px; margin: 60px auto; padding: 24px; }
        @media (max-width: 650px) {
          .admin-wrap { width: min(100% - 24px, 1120px); }
          .admin-main { padding-top: 25px; }
          .admin-stats { grid-template-columns: 1fr 1fr; gap: 10px; margin: 21px 0; }
          .admin-stat { padding: 14px; }
          .admin-stat:last-child { grid-column: 1 / -1; }
          .admin-stat-number { font-size: 27px; }
          .admin-panel-head { padding: 19px 16px 0; }
          .admin-tabs { padding: 0 10px; gap: 0; }
          .admin-tab { padding: 13px 8px; font-size: 12px; }
          .admin-content { padding: 17px 12px; }
          .admin-doc-card { padding: 14px; }
          .admin-details { gap: 10px; padding: 11px; }
          .admin-pill { font-size: 11px; }
          .admin-actions { display: grid; grid-template-columns: 1fr 1fr; }
          .admin-actions .admin-view { grid-column: 1 / -1; }
          .admin-actions .admin-button { width: 100%; }
        }
      `}</style>

      <header className="admin-topbar">
        <div className="admin-wrap admin-brand">
          <div className="admin-brand-mark">⌂</div>
          <div>
            <div className="admin-brand-name">Static Holidays</div>
            <div className="admin-brand-sub">
              Administrator · Document verification
            </div>
          </div>
          <span className="admin-pill">✓ Admin access</span>
        </div>
      </header>

      <div className="admin-wrap admin-main">
        <div className="admin-heading-row">
          <div>
            <div className="admin-eyebrow">Verification centre</div>
            <h1 className="admin-title">Document review</h1>
            <p className="admin-description">
              Review guest identities and host compliance documents securely.
            </p>
          </div>
          <button
            className="admin-button"
            disabled={loadingDocs}
            onClick={() => loadDocuments()}
          >
            {loadingDocs ? "Refreshing..." : "↻ Refresh documents"}
          </button>
        </div>

        <section className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-top">
              Guest IDs pending
              <span className="admin-stat-icon">▤</span>
            </div>
            <div className="admin-stat-number">{guestDocs.length}</div>
            <div className="admin-stat-caption">
              Identity submissions awaiting review
            </div>
          </div>

          <div className="admin-stat">
            <div className="admin-stat-top">
              Host documents pending
              <span className="admin-stat-icon">⌂</span>
            </div>
            <div className="admin-stat-number">{hostDocs.length}</div>
            <div className="admin-stat-caption">
              Compliance documents awaiting review
            </div>
          </div>

          <div className="admin-stat">
            <div className="admin-stat-top">
              Review centre
              <span className="admin-stat-icon">✓</span>
            </div>
            <div className="admin-stat-number">Secure</div>
            <div className="admin-stat-caption">
              Private files · Administrator-only review
            </div>
          </div>
        </section>

        {error && <div className="admin-alert error">{error}</div>}
        {message && <div className="admin-alert success">{message}</div>}

        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2 className="admin-panel-title">Documents awaiting review</h2>
            <p className="admin-panel-subtitle">
              Open each private document and check the details before making a
              decision.
            </p>
          </div>

          <div className="admin-tabs">
            <button
              className={`admin-tab ${section === "guests" ? "active" : ""}`}
              onClick={() => setSection("guests")}
            >
              Guest IDs
              <span className="admin-tab-count">{guestDocs.length}</span>
            </button>
            <button
              className={`admin-tab ${section === "hosts" ? "active" : ""}`}
              onClick={() => setSection("hosts")}
            >
              Host documents
              <span className="admin-tab-count">{hostDocs.length}</span>
            </button>
          </div>

          <div className="admin-content">
            {section === "guests" ? (
              <>
                <h3 className="admin-section-heading">
                  Pending guest identity checks
                </h3>

                {guestDocs.length === 0 && (
                  <div className="admin-empty">
                    <div className="admin-empty-icon">✓</div>
                    <div className="admin-empty-title">
                      All guest IDs reviewed
                    </div>
                    <div>There are no guest identity submissions awaiting review.</div>
                  </div>
                )}

                {guestDocs.map((doc) => (
                  <article className="admin-doc-card" key={doc.id}>
                    <div className="admin-doc-header">
                      <div className="admin-doc-icon">▤</div>
                      <div className="admin-doc-info">
                        <h3 className="admin-doc-title">
                          Guest identity document
                        </h3>
                        <div className="admin-doc-subtitle">
                          Submitted {dateLabel(doc.submitted_at)}
                        </div>
                      </div>
                      <span className="admin-status">Pending</span>
                    </div>

                    <div className="admin-details">
                      <div>
                        <div className="admin-detail-label">Guest user ID</div>
                        <div className="admin-detail-value">{doc.user_id}</div>
                      </div>
                      <div>
                        <div className="admin-detail-label">Submitted on</div>
                        <div className="admin-detail-value">
                          {dateLabel(doc.submitted_at)}
                        </div>
                      </div>
                    </div>

                    <p className="admin-note">
                      Check the document before approving the guest's identity.
                    </p>

                    <div className="admin-actions">
                      <button
                        className="admin-button admin-view"
                        onClick={() =>
                          openPrivateFile(
                            "identity-documents",
                            doc.document_path
                          )
                        }
                      >
                        ↗ View private document
                      </button>
                      <button
                        className="admin-button admin-approve"
                        disabled={busyId === doc.id}
                        onClick={() => reviewGuest(doc, "approved")}
                      >
                        {busyId === doc.id ? "Processing..." : "✓ Approve"}
                      </button>
                      <button
                        className="admin-button admin-reject"
                        disabled={busyId === doc.id}
                        onClick={() => reviewGuest(doc, "rejected")}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </article>
                ))}
              </>
            ) : (
              <>
                <h3 className="admin-section-heading">
                  Pending host compliance checks
                </h3>

                {hostDocs.length === 0 && (
                  <div className="admin-empty">
                    <div className="admin-empty-icon">✓</div>
                    <div className="admin-empty-title">
                      All host documents reviewed
                    </div>
                    <div>There are no host documents awaiting review.</div>
                  </div>
                )}

                {hostDocs.map((doc) => (
                  <article className="admin-doc-card" key={doc.id}>
                    <div className="admin-doc-header">
                      <div className="admin-doc-icon">⌂</div>
                      <div className="admin-doc-info">
                        <h3 className="admin-doc-title">
                          {doc.document_type.replace(/_/g, " ")}
                        </h3>
                        <div className="admin-doc-subtitle">
                          Host compliance document
                        </div>
                      </div>
                      <span className="admin-status">Pending</span>
                    </div>

                    <div className="admin-details">
                      <div>
                        <div className="admin-detail-label">Host user ID</div>
                        <div className="admin-detail-value">{doc.host_id}</div>
                      </div>
                      <div>
                        <div className="admin-detail-label">Uploaded</div>
                        <div className="admin-detail-value">
                          {dateLabel(doc.uploaded_at)}
                        </div>
                      </div>
                      <div>
                        <div className="admin-detail-label">Expiry date</div>
                        <div className="admin-detail-value">
                          {dateLabel(doc.expiry_date)}
                        </div>
                      </div>
                      <div>
                        <div className="admin-detail-label">Document status</div>
                        <div className="admin-detail-value">Awaiting review</div>
                      </div>
                    </div>

                    {doc.notes && (
                      <p className="admin-note">Notes: {doc.notes}</p>
                    )}

                    <div className="admin-actions">
                      {doc.file_url ? (
                        <button
                          className="admin-button admin-view"
                          onClick={() =>
                            openPrivateFile("host-documents", doc.file_url!)
                          }
                        >
                          ↗ View private document
                        </button>
                      ) : (
                        <span className="admin-note">
                          No document file path is available for this record.
                        </span>
                      )}

                      <button
                        className="admin-button admin-approve"
                        disabled={busyId === doc.id}
                        onClick={() => reviewHost(doc, "approved")}
                      >
                        {busyId === doc.id ? "Processing..." : "✓ Approve"}
                      </button>

                      <button
                        className="admin-button admin-reject"
                        disabled={busyId === doc.id}
                        onClick={() => reviewHost(doc, "rejected")}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </article>
                ))}
              </>
            )}
          </div>
        </section>

        <footer className="admin-footer">
          <Link to="/">← Return to Static Holidays</Link>
          <div style={{ marginTop: 9 }}>
            Private documents should only be accessed for legitimate verification.
          </div>
        </footer>
      </div>
    </main>
  );
}
