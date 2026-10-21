
import { useEffect, useState } from "react";
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
  notes: string | null;
};

export default function AdminDocumentReview() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [section, setSection] = useState<"guests" | "hosts">("guests");
  const [guestDocs, setGuestDocs] = useState<GuestDocument[]>([]);
  const [hostDocs, setHostDocs] = useState<HostDocument[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function initialise() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
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
      await loadDocuments(cancelled);
      if (!cancelled) setChecking(false);
    }

    initialise();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function loadDocuments(cancelled = false) {
    setError("");

    const [guestResult, hostResult] = await Promise.all([
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
          "id, host_id, document_type, file_url, status, uploaded_at, notes"
        )
        .eq("status", "pending")
        .order("uploaded_at", { ascending: true }),
    ]);

    if (cancelled) return;

    if (guestResult.error || hostResult.error) {
      setError(
        guestResult.error?.message ||
          hostResult.error?.message ||
          "Could not load documents."
      );
      return;
    }

    setGuestDocs((guestResult.data || []) as GuestDocument[]);
    setHostDocs((hostResult.data || []) as HostDocument[]);
  }

  async function openPrivateFile(bucket: string, path: string) {
    const { data, error: fileError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60);

    if (fileError || !data?.signedUrl) {
      setError(fileError?.message || "Could not open the document.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function reviewGuest(
    document: GuestDocument,
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

    setBusyId(document.id);
    setError("");
    setMessage("");

    const { error: reviewError } = await supabase.rpc(
      "review_identity_verification",
      {
        p_verification_id: document.id,
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

    setBusyId(null);
  }

  async function reviewHost(
    document: HostDocument,
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

    setBusyId(document.id);
    setError("");
    setMessage("");

    const { error: reviewError } = await supabase.rpc(
      "review_host_document",
      {
        p_document_id: document.id,
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

    setBusyId(null);
  }

  if (checking) {
    return <main style={page}><p>Checking administrator access...</p></main>;
  }

  if (!isAdmin) {
    return (
      <main style={page}>
        <h1>Access denied</h1>
        <p>{error || "Administrator access is required."}</p>
        <Link to="/">Return home</Link>
      </main>
    );
  }

  return (
    <main style={page}>
      <h1>Admin Document Review</h1>
      <p>Review guest identity documents and host compliance documents.</p>

      <p>
        <button onClick={() => setSection("guests")}>
          Guest IDs ({guestDocs.length})
        </button>{" "}
        <button onClick={() => setSection("hosts")}>
          Host documents ({hostDocs.length})
        </button>{" "}
        <button onClick={() => loadDocuments()}>
          Refresh
        </button>
      </p>

      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {message && <p style={{ color: "#166534" }}>{message}</p>}

      {section === "guests" && (
        <section>
          <h2>Pending guest IDs</h2>
          {guestDocs.length === 0 && <p>No guest IDs are awaiting review.</p>}

          {guestDocs.map((doc) => (
            <article key={doc.id} style={card}>
              <p><strong>Guest user ID:</strong> {doc.user_id}</p>
              <p><strong>Submitted:</strong> {new Date(doc.submitted_at).toLocaleString()}</p>

              <button
                onClick={() =>
                  openPrivateFile("identity-documents", doc.document_path)
                }
              >
                View private document
              </button>{" "}

              <button
                disabled={busyId === doc.id}
                onClick={() => reviewGuest(doc, "approved")}
              >
                Approve
              </button>{" "}

              <button
                disabled={busyId === doc.id}
                onClick={() => reviewGuest(doc, "rejected")}
              >
                Reject
              </button>
            </article>
          ))}
        </section>
      )}

      {section === "hosts" && (
        <section>
          <h2>Pending host documents</h2>
          {hostDocs.length === 0 && <p>No host documents are awaiting review.</p>}

          {hostDocs.map((doc) => (
            <article key={doc.id} style={card}>
              <p><strong>Host user ID:</strong> {doc.host_id}</p>
              <p><strong>Document type:</strong> {doc.document_type}</p>
              <p><strong>Uploaded:</strong> {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : "Unknown"}</p>

              {doc.file_url && (
                <button
                  onClick={() =>
                    openPrivateFile("host-documents", doc.file_url!)
                  }
                >
                  View private document
                </button>
              )}{" "}

              <button
                disabled={busyId === doc.id}
                onClick={() => reviewHost(doc, "approved")}
              >
                Approve
              </button>{" "}

              <button
                disabled={busyId === doc.id}
                onClick={() => reviewHost(doc, "rejected")}
              >
                Reject
              </button>
            </article>
          ))}
        </section>
      )}

      <p style={{ marginTop: 30 }}>
        <Link to="/">Return to website</Link>
      </p>
    </main>
  );
}

const page = {
  maxWidth: 1000,
  margin: "0 auto",
  padding: 24,
  color: "#1f2937",
} as const;

const card = {
  border: "1px solid #d1d5db",
  borderRadius: 10,
  padding: 16,
  marginBottom: 16,
} as const;
