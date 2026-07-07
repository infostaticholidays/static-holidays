import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function HostCompliance() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  // -------------------------
  // LOAD USER + PROFILE
  // -------------------------
  async function loadData() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    setUser(user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profileData) {
      navigate("/account");
      return;
    }

    setProfile(profileData);

    // TEMP: later we replace with real table (host_documents)
    const { data: docs } = await supabase
      .from("host_documents")
      .select("*")
      .eq("host_id", user.id);

    setDocuments(docs || []);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

    // -------------------------
  // UPLOAD DOCUMENT
  // -------------------------

   async function uploadDocument(type: string, file?: File) {

    if (!file || !user) return;

    const filePath = `${user.id}/${type}-${Date.now()}-${file.name}`;


    const { error: uploadError } = await supabase.storage
      .from("host-documents")
      .upload(filePath, file);


    if (uploadError) {
      alert(uploadError.message);
      return;
    }


    await supabase
      .from("host_documents")
      .insert({
        host_id: user.id,
        document_type: type,
        file_path: filePath,
        status: "pending",
      });


    alert("Document uploaded successfully");

    loadData();
  }



  // -------------------------
  // PROGRESS CALCULATION
  // -------------------------
  const requiredDocs = [
    "owner_id",
    "proof_address",
    "ownership",
    "insurance",
    "gas_safety",
    "eicr",
    "pat",
    "fire_safety",
    "smoke_alarm",
  ];

  const approvedDocs = documents.filter(
    (d) => d.status === "approved"
  ).length;

  const progress = Math.round(
    (approvedDocs / requiredDocs.length) * 100
  );

  const status =
    progress === 100
      ? "🟢 Verified"
      : progress >= 50
      ? "🟡 In Progress"
      : "🔴 Not Verified";

  // -------------------------
  // UI
  // -------------------------
  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 40 }}>

      {/* HEADER */}
      <h1>
        📋 {profile?.full_name
          ? `${profile.full_name}'s Compliance Centre`
          : "Compliance Centre"}
      </h1>

      <p>
        Complete your documents to start receiving bookings.
      </p>

      {/* STATUS CARD */}
      <div style={card}>
        <h2>Overall Status</h2>
        <p>{status}</p>

        {/* PROGRESS BAR */}
        <div style={barBg}>
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#16a34a",
              transition: "0.3s",
            }}
          />
        </div>

        <p>
          {progress}% complete ({approvedDocs} /{" "}
          {requiredDocs.length})
        </p>
      </div>

      {/* OWNER SECTION */}
      <div style={card}>
        <h2>👤 Owner Verification</h2>

   <DocumentRow
  title="Passport / Driving Licence"
  type="passport"
/>

<DocumentRow
  title="Proof of Address"
  type="proof_address"
/>

<DocumentRow
  title="Ownership Proof"
  type="ownership"
/>

      {/* INSURANCE */}
      <div style={card}>
        <h2>🛡 Insurance</h2>

      
      <DocumentRow
  title="Public Liability (£2m)"
  type="public_liability"
/>

<DocumentRow
  title="Holiday Let Insurance"
  type="holiday_insurance"
/>

      {/* SAFETY */}
      <div style={card}>
        <h2>🔥 Safety Certificates</h2>

     <DocumentRow
  title="Gas Safety (CP12)"
  type="gas_safety"
/>

<DocumentRow
  title="EICR Certificate"
  type="eicr"
/>

<DocumentRow
  title="PAT Testing"
  type="pat"
/>

<DocumentRow
  title="Fire Risk Assessment"
  type="fire_safety"
/>

<DocumentRow
  title="Smoke/CO Alarm Proof"
  type="smoke_alarm"
/>

      {/* ACTION */}
   function DocumentRow({ title, type }: any) {
  return (
    <div style={row}>
      <div>
        <strong>{title}</strong>

        <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
          Status: Pending
        </p>
      </div>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) =>
          uploadDocument(
            type,
            e.target.files?.[0]
          )
        }
      />
    </div>
  );
}

// -------------------------
// SIMPLE DOCUMENT ROW
// -------------------------
function DocumentRow({ title }: { title: string }) {
  return (
    <div style={row}>
      <div>
        <strong>{title}</strong>
        <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
          Status: Pending
        </p>
      </div>

      <button style={smallBtn}>Upload</button>
    </div>
  );
}

// -------------------------
// STYLES
// -------------------------
const card = {
  background: "#f5f5f5",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #ddd",
};

const barBg = {
  width: "100%",
  height: 12,
  background: "#ddd",
  borderRadius: 20,
  overflow: "hidden",
  marginTop: 10,
};

const btn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: 8,
  cursor: "pointer",
};

const smallBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};
