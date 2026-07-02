import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function HostVerification() {
  const [idFile, setIdFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

  async function uploadFiles() {
    const user = await supabase.auth.getUser();

    if (!user.data.user) return;

    const userId = user.data.user.id;

    if (idFile) {
      await supabase.storage
        .from("documents")
        .upload(`${userId}/id-${Date.now()}`, idFile);
    }

    if (insuranceFile) {
      await supabase.storage
        .from("documents")
        .upload(`${userId}/insurance-${Date.now()}`, insuranceFile);
    }

    await supabase
      .from("profiles")
      .update({
        id_verified: true,
        insurance_verified: true,
      })
      .eq("id", userId);

    alert("Documents submitted!");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>📄 Host Verification</h1>

      <p>Upload your ID and insurance to become a host.</p>

      <input type="file" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
      <br /><br />

      <input type="file" onChange={(e) => setInsuranceFile(e.target.files?.[0] || null)} />
      <br /><br />

      <button onClick={uploadFiles} style={{ padding: 10 }}>
        Submit Documents
      </button>
    </div>
  );
}
