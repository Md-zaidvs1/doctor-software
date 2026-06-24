import React, { useState, useEffect } from 'react';

const InvoiceForm = ({ clinicId, patients, treatmentRecords, onFormSubmit, onCancel }) => {
  const [patientId, setPatientId] = useState('');
  const [treatmentRecordId, setTreatmentRecordId] = useState('');
  const [items, setItems] = useState([{ description: 'Consultation Fee', quantity: 1, unitPrice: 500 }]);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');

  // Sync up treatment data profiles automatically when selected to auto-populate invoice line rows
  useEffect(() => {
    if (treatmentRecordId) {
      const match = treatmentRecords.find((r) => r._id === treatmentRecordId);
      if (match && match.procedures && match.procedures.length > 0) {
        const structuralRows = match.procedures.map((p) => ({
          description: p.name,
          quantity: 1,
          unitPrice: p.cost,
        }));
        setItems(structuralRows);
      }
    }
  }, [treatmentRecordId, treatmentRecords]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'description' ? value : Number(value);
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateGrandTotal = () => {
    const subTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    return subTotal + Number(taxAmount) - Number(discountAmount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Invoice configuration maps require at least one line entry.');
      return;
    }
    onFormSubmit({
      clinicId,
      patientId,
      treatmentRecordId: treatmentRecordId || null,
      items,
      taxAmount: Number(taxAmount),
      discountAmount: Number(discountAmount),
      amountPaid: Number(amountPaid),
      paymentMode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-6 border-t-4 border-emerald-600">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Generate Patient Statement / Invoice Receipt</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Target Account Patient *</label>
          <select value={patientId} onChange={(e) => { setPatientId(e.target.value); setTreatmentRecordId(''); }} required className="w-full border p-2 rounded">
            <option value="">-- Choose Target File Account --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Link Completed Encounter Chart (Optional)</label>
          <select value={treatmentRecordId} onChange={(e) => setTreatmentRecordId(e.target.value)} className="w-full border p-2 rounded bg-gray-50 text-sm">
            <option value="">-- No Encounter Links (Custom Line Generation) --</option>
            {treatmentRecords
              .filter((r) => r.patientId?._id === patientId)
              .map((r) => (
                <option key={r._id} value={r._id}>Diagnosis: {r.diagnosis} ({new Date(r.createdAt).toLocaleDateString()})</option>
              ))}
          </select>
        </div>
      </div>

      {/* Billable Rows Configurator Grid */}
      <div className="space-y-2">
        <div className="flex justify-between items-center"><span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Billable Statement Lines</span>
          <button type="button" onClick={addItemRow} className="text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded hover:bg-black">+ Add Line Row</button>
        </div>
        
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-6">
              <input type="text" placeholder="Line Description nomenclature" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required className="w-full border p-1.5 text-sm rounded" />
            </div>
            <div className="md:col-span-2">
              <input type="number" placeholder="Qty" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required className="w-full border p-1.5 text-sm rounded" />
            </div>
            <div className="md:col-span-3">
              <input type="number" placeholder="Unit Price (INR)" min="0" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} required className="w-full border p-1.5 text-sm rounded" />
            </div>
            <div className="md:col-span-1 text-center">
              <button type="button" onClick={() => removeItemRow(index)} className="text-red-500 font-bold text-sm hover:text-red-800">✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* Adjustments Segment */}
      <div className="bg-gray-50 p-4 rounded grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Tax Adjustments (+)</label>
          <input type="number" min="0" value={taxAmount} onChange={(e) => setTaxAmount(e.target.value)} className="w-full border p-1 rounded bg-white text-sm" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Discount Schemes (-)</label>
          <input type="number" min="0" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} className="w-full border p-1 rounded bg-white text-sm" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Point Collections Paid</label>
          <input type="number" min="0" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="w-full border p-1 rounded bg-white text-sm font-semibold text-green-700" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Payment Method</label>
          <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full border p-1 rounded bg-white text-sm">
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
          </select>
        </div>
        <div className="col-span-2 md:col-span-1 text-right">
          <span className="text-xs font-bold text-gray-400 block uppercase">Calculated Value:</span>
          <span className="text-xl font-black text-gray-900">₹{calculateGrandTotal()}</span>
        </div>
      </div>

      <div className="flex space-x-2 justify-end">
        <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded text-sm font-bold hover:bg-emerald-700 shadow-md">
          Commit Invoice Structure & Lock Ledger
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;