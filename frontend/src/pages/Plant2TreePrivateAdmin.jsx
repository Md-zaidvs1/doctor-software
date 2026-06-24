// Plant2TreePrivateAdmin.jsx
import React, { useState, useEffect } from "react";

export default function Plant2TreePrivateAdmin() {
  const [clientRegistry, setClientRegistry] = useState([]);
  const [form, setForm] = useState({
    clinicName: "",
    ownerName: "",
    phone: "",
    type: "Dental",
    licenseKey: "",
    purchaseDate: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("p2t_admin_clients");
    if (saved) {
      setClientRegistry(JSON.parse(saved));
    }
  }, []);

  const handleAddClient = () => {
    const expiryDate = new Date(form.purchaseDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const newClient = {
      ...form,
      id: Date.now(),
      expiryDate: expiryDate.toISOString().split("T")[0],
      status: expiryDate > new Date() ? "Active" : "Expired",
    };

    const updated = [...clientRegistry, newClient];
    setClientRegistry(updated);
    localStorage.setItem("p2t_admin_clients", JSON.stringify(updated));
    setForm({
      clinicName: "",
      ownerName: "",
      phone: "",
      type: "Dental",
      licenseKey: "",
      purchaseDate: "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Plant2Tree Admin</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Clinic Name"
          value={form.clinicName}
          onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Owner Name"
          value={form.ownerName}
          onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2 mr-2"
        >
          <option>Dental</option>
          <option>ENT</option>
          <option>Eye</option>
          <option>Ortho</option>
          <option>General</option>
        </select>
        <input
          type="text"
          placeholder="License Key"
          value={form.licenseKey}
          onChange={(e) => setForm({ ...form, licenseKey: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          placeholder="Purchase Date"
          value={form.purchaseDate}
          onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddClient} className="bg-blue-500 text-white px-4 py-2">
          Add New Client
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Clinic Name</th>
            <th>Owner</th>
            <th>Phone</th>
            <th>Type</th>
            <th>License Key</th>
            <th>Expiry</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {clientRegistry.map((client) => (
            <tr key={client.id}>
              <td>{client.clinicName}</td>
              <td>{client.ownerName}</td>
              <td>{client.phone}</td>
              <td>{client.type}</td>
              <td>{client.licenseKey}</td>
              <td>{client.expiryDate}</td>
              <td>{client.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
