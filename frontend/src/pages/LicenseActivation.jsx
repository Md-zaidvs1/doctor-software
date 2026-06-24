// LicenseActivation.jsx
import React, { useState } from "react";
import { activateLicense } from "../services/licenseService";

export default function LicenseActivation() {
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState("");

  const handleActivate = async () => {
    const cleanKey = licenseKey.trim();
    if (cleanKey.startsWith("P2T-")) {
      try {
        const res = await activateLicense(cleanKey);
        setStatus(res.success ? "License Activated!" : "Invalid License Key");
      } catch (err) {
        setStatus("Error activating license");
      }
    } else {
      setStatus("Invalid License Key");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Activate License</h2>
      <input
        type="text"
        value={licenseKey}
        onChange={(e) => setLicenseKey(e.target.value)}
        placeholder="Enter License Key"
        className="border p-2 mr-2"
      />
      <button onClick={handleActivate} className="bg-blue-500 text-white px-4 py-2">
        Activate
      </button>
      <p className="mt-4">{status}</p>
    </div>
  );
}
