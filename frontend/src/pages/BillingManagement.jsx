import React, { useState } from "react";

export default function BillingManagement() {
  const [items, setItems] = useState([
    { id: 1, name: "Consultation", price: 500 },
    { id: 2, name: "X-Ray", price: 300 },
  ]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6">
      {/* Print CSS */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .print-receipt, .print-receipt * { visibility: visible; }
            .print-receipt {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              padding: 40px;
            }
            .no-print { display: none !important; }
          }
        `}
      </style>

      {/* Header (hidden in print) */}
      <div className="no-print mb-4">
        <h2 className="text-xl font-bold">Billing Management</h2>
      </div>

      {/* Receipt Content */}
      <div className="print-receipt border p-4 bg-white">
        <h3 className="text-lg font-semibold mb-2">Receipt</h3>
        <ul>
          {items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
            </li>
          ))}
        </ul>
        <hr className="my-2" />
        <p className="font-bold">Total: ₹{total}</p>
      </div>

      {/* Sidebar / Actions (hidden in print) */}
      <div className="no-print mt-4">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}
