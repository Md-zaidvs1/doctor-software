import React, { useState } from 'react';

const BillingModule = ({ patientId, patientName = "John Doe" }) => {
  const [items, setItems] = useState([
    { id: 1, service: 'Consultation & X-Ray', cost: 500 },
    { id: 2, service: 'Composite Tooth Filling (Tooth #32)', cost: 1500 }
  ]);
  
  const [newService, setNewService] = useState('');
  const [newCost, setNewCost] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newService || !newCost) return;
    
    setItems([...items, {
      id: Date.now(),
      service: newService,
      cost: Number(newCost)
    }]);
    
    setNewService('');
    setNewCost('');
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.cost, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f2f6', paddingBottom: '10px' }}>
        <h2>Apex Dental Invoice & Billing</h2>
        <button 
          onClick={handlePrint}
          style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Print Receipt (PDF)
        </button>
      </div>

      {/* Patient Meta Details */}
      <div style={{ display: 'flex', gap: '40px', margin: '20px 0', background: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
        <div><strong>Patient Name:</strong> {patientName}</div>
        <div><strong>Patient ID:</strong> {patientId}</div>
        <div><strong>Status:</strong> <span style={{ color: isPaid ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>{isPaid ? 'PAID' : 'PENDING'}</span></div>
      </div>

      {/* Add Items Form */}
      <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Service Name (e.g., Root Canal, Cleaning)" 
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        <input 
          type="number" 
          placeholder="Cost (₹)" 
          value={newCost}
          onChange={(e) => setNewCost(e.target.value)}
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        <button type="submit" style={{ background: '#3498db', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Add Item
        </button>
      </form>

      {/* Invoice Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px' }}>
        <thead>
          <tr style={{ background: '#f1f2f6', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Treatment / Service Description</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd', width: '150px' }}>Amount (₹)</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd', width: '100px', textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{item.service}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>₹{item.cost}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '16px' }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
          <tr style={{ background: '#fafafa', fontWeight: 'bold' }}>
            <td style={{ padding: '12px', textAlign: 'right' }}>Total Payable Amount:</td>
            <td style={{ padding: '12px', fontSize: '18px', color: '#2c3e50' }} colSpan="2">₹{totalAmount}</td>
          </tr>
        </tbody>
      </table>

      {/* Action Actions */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => setIsPaid(!isPaid)}
          style={{ background: isPaid ? '#7f8c8d' : '#e67e22', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isPaid ? 'Mark as Unpaid' : 'Receive Cash/UPI Payment'}
        </button>
      </div>
    </div>
  );
};

export default BillingModule;