import React, { useState, useEffect } from 'react';

const InvoiceBillingModule = ({ patientId }) => {
  const [items, setItems] = useState([
    { id: 1, procedureName: "Deep Scaling & Polishing", cost: 1500, qty: 1 },
    { id: 2, procedureName: "Root Canal Treatment (RCT)", cost: 6500, qty: 1 }
  ]);

  // Form input nodes states
  const [newProcedure, setNewProcedure] = useState('');
  const [newCost, setNewCost] = useState('');

  // Math variables for GST breakdown
  const subTotal = items.reduce((acc, item) => acc + (item.cost * item.qty), 0);
  const cgst = subTotal * 0.09; // 9% Central GST
  const sgst = subTotal * 0.09; // 9% State GST
  const grandTotal = subTotal + cgst + sgst;

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newProcedure || !newCost) return alert("Please fill item configurations!");

    const newItem = {
      id: Date.now(),
      procedureName: newProcedure,
      cost: Number(newCost),
      qty: 1
    };

    setItems([...items, newItem]);
    setNewProcedure('');
    setNewCost('');
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '30px', marginTop: '10px', fontFamily: 'sans-serif' }}>
      
      {/* 💳 ITEM ADDITION CORRIDOR */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
        <h4 style={{ margin: '0 0 20px 0', color: '#0f172a', fontWeight: '800', fontSize: '15px' }}>➕ Add Treatment Line Item</h4>
        
        <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Procedure / Material Name:</label>
            <input type="text" placeholder="e.g. Ceramic Crown / Implant Extraction" value={newProcedure} onChange={(e) => setNewProcedure(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Unit Procedure Cost (INR):</label>
            <input type="number" placeholder="e.g. 4500" value={newCost} onChange={(e) => setNewCost(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} required />
          </div>

          <button type="submit" style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', marginTop: '5px' }}>
            ⚡ Push into Ledger
          </button>
        </form>
      </div>

      {/* 📑 LIVE GST INVOICE SHEET VIEW */}
      <div style={{ background: '#fff', padding: '35px', borderRadius: '24px', border: '1px solid #cbd5e1', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} id="invoice-print-area">
        
        {/* INVOICE BRANDING TOP HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px', fontWeight: '800' }}>RK DENTAL CLINIC</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>📍 MG Road, Bangalore, KA - 560001</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>GSTIN: 29AAAAA1111A1Z1</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h1 style={{ margin: 0, color: '#cbd5e1', fontSize: '24px', fontWeight: '900', letterSpacing: '1px' }}>TAX INVOICE</h1>
            <span style={{ fontSize: '12px', color: '#475569', display: 'block', marginTop: '5px' }}>Date: {new Date().toLocaleDateString()}</span>
            <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold', display: 'inline-block', marginTop: '5px' }}>
              🎯 Patient Reference: {patientId || "WALK-IN-NODE"}
            </span>
          </div>
        </div>

        {/* ITEMS GRID TABLE */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '30px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #0f172a', color: '#0f172a', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 5px' }}>Treatment Description</th>
              <th style={{ padding: '10px 5px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '10px 5px', textAlign: 'right' }}>Unit Price</th>
              <th style={{ padding: '10px 5px', textAlign: 'right' }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#334155' }}>
                <td style={{ padding: '14px 5px', fontWeight: '600' }}>🦷 {item.procedureName}</td>
                <td style={{ padding: '14px 5px', textAlign: 'center' }}>{item.qty}</td>
                <td style={{ padding: '14px 5px', textAlign: 'right' }}>₹{item.cost}.00</td>
                <td style={{ padding: '14px 5px', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>₹{item.cost * item.qty}.00</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* GST ACCUMULATION MATRIX BREAKDOWN */}
        <div style={{ width: '45%', marginLeft: '55%', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569', borderTop: '2px solid #f1f5f9', paddingTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Sub-Total Gross Value:</span>
            <strong style={{ color: '#0f172a' }}>₹{subTotal}.00</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Central GST (CGST @ 9%):</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>State GST (SGST @ 9%):</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '10px', marginTop: '5px', fontSize: '16px' }}>
            <strong style={{ color: '#0f172a' }}>Grand Total (INR):</strong>
            <strong style={{ color: '#166534', fontSize: '18px' }}>₹{grandTotal.toFixed(2)}</strong>
          </div>
        </div>

        {/* ACTION BUTTON CONTROLS */}
        <button onClick={handlePrintInvoice} style={{ width: '100%', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '35px', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}>
          🖨️ Finalize Ledger & Print Tax Invoice Receipt
        </button>
      </div>

    </div>
  );
};

export default InvoiceBillingModule;