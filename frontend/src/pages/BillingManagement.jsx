import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { authService } from '../services/authService';
import Sidebar from '../components/dashboard/Sidebar';

const BillingManagement = () => {
  const currentUser = authService.getCurrentUser();
  const activeClinicId = currentUser?.clinicId || '6a391e7b5d9d49d512d572d6';

  // State Matrix Logs
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states matching backend keys
  const [formData, setFormData] = useState({
    patientId: '',
    itemDescription: 'Dental Treatment Services',
    totalAmount: '',
    paidAmount: '',
    paymentMode: 'Cash',
    paymentStatus: 'Unpaid'
  });

  useEffect(() => {
    fetchFinancialDataMatrix();
  }, []);

  const fetchFinancialDataMatrix = async () => {
    try {
      setLoading(true);
      setError('');
      
      const contextQuery = `?clinicId=${activeClinicId}&tenantId=${activeClinicId}`;

      const [billingRes, patientsRes] = await Promise.all([
        apiClient.get(`/billing${contextQuery}`),
        apiClient.get(`/patients${contextQuery}`)
      ]);

      if (billingRes.success) setBills(billingRes.data || []);
      if (patientsRes.success) setPatients(patientsRes.data || []);
    } catch (err) {
      setError('System structural failure compiling transaction databases indexes.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'totalAmount' || name === 'paidAmount') {
        const total = parseFloat(name === 'totalAmount' ? value : prev.totalAmount) || 0;
        const paid = parseFloat(name === 'paidAmount' ? value : prev.paidAmount) || 0;
        
        if (paid === 0) updated.paymentStatus = 'Unpaid';
        else if (paid >= total) updated.paymentStatus = 'Paid';
        else updated.paymentStatus = 'Partially Paid';
      }
      return updated;
    });
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const total = Number(formData.totalAmount) || 0;
    const paid = Number(formData.paidAmount) || 0;
    const balance = Math.max(0, total - paid);

    const payload = {
      clinicId: activeClinicId,
      patientId: formData.patientId,
      items: [
        {
          description: formData.itemDescription || 'Dental Treatment Services',
          quantity: 1,
          unitPrice: total,
          totalPrice: total
        }
      ],
      subTotal: total,
      taxAmount: 0,
      discountAmount: 0,
      grandTotal: total,
      amountPaid: paid,
      balanceDue: balance,
      paymentMode: formData.paymentMode,
      paymentStatus: formData.paymentStatus
    };

    try {
      setLoading(true);
      const res = await apiClient.post('/billing', payload);
      if (res.success) {
        setSuccessMsg(`Invoice compiled successfully for account assignment node.`);
        setFormData({
          patientId: '',
          itemDescription: 'Dental Treatment Services',
          totalAmount: '',
          paidAmount: '',
          paymentMode: 'Cash',
          paymentStatus: 'Unpaid'
        });
        fetchFinancialDataMatrix();
      } else {
        setError(res.message || 'Operation rejected at financial validation pipeline entry.');
      }
    } catch (err) {
      setError('Network level transaction exception posting payment ledger logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSettleAction = async (id) => {
    try {
      const targetBill = bills.find(b => b._id === id);
      if (!targetBill) return;

      const res = await apiClient.put(`/billing/${id}`, {
        clinicId: activeClinicId,
        amountPaid: targetBill.grandTotal,
        balanceDue: 0,
        paymentStatus: 'Paid'
      });
      if (res.success) {
        fetchFinancialDataMatrix();
      }
    } catch (err) {
      setError('Could not apply full transaction settlement update.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Invoicing & Ledger Records</h1>
            <p className="text-xs text-slate-500 mt-1">Generate multi-tenant client bills, track payment channel settlements, and audit open balance points.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-lg">⚠️ Error: {error}</div>}
          {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold p-4 rounded-lg">✅ {successMsg}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Invoice Compilation Form */}
            <form onSubmit={handleInvoiceSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 lg:col-span-1 shadow-xs">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b pb-1.5 mb-2">Compile New Patient Bill</h2>
              
              <div>
                <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Target Account Profile *</label>
                <select name="patientId" required value={formData.patientId} onChange={handleInputChange} className="w-full border border-slate-300 p-2 rounded-md text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">-- Choose Patient Account --</option>
                  {patients.map(p => (
                    <option key={p._id} value={p._id}>{p.name} [{p.patientId || 'EMR'}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Service / Treatment Item Description *</label>
                <input type="text" name="itemDescription" required value={formData.itemDescription} onChange={handleInputChange} placeholder="e.g. Root Canal Treatment" className="w-full border border-slate-300 p-2 rounded-md text-xs bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Gross Amount (INR) *</label>
                  <input type="number" name="totalAmount" required value={formData.totalAmount} onChange={handleInputChange} placeholder="Gross Total" className="w-full border border-slate-300 p-1.5 rounded-md text-xs bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Paid Settlement *</label>
                  <input type="number" name="paidAmount" required value={formData.paidAmount} onChange={handleInputChange} placeholder="Amount Tendered" className="w-full border border-slate-300 p-1.5 rounded-md text-xs bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Payment Method</label>
                  <select name="paymentMode" value={formData.paymentMode} onChange={handleInputChange} className="w-full border border-slate-300 p-1.5 rounded-md text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / Digital</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-3xs font-black uppercase tracking-wider text-slate-500 mb-1">Calculated Status State</label>
                  <div className="w-full bg-slate-100 p-2 rounded-md text-xs font-bold text-slate-700 text-center border font-mono">
                    {formData.paymentStatus}
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading || patients.length === 0} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-2.5 rounded-md text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-50">
                {loading ? 'Locking Ledger Transits...' : 'Publish Secure Invoice'}
              </button>
            </form>

            {/* Financial History Logs Tracker */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden lg:col-span-2 shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/75">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Historical Transactions Ledger</h3>
                <span className="text-3xs font-mono bg-slate-200 px-2 py-0.5 rounded font-bold uppercase text-slate-600">Invoices Tracked: {bills.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/50 border-b border-slate-200 text-3xs font-bold uppercase tracking-widest text-slate-500">
                      <th className="p-4">Invoice Client Target</th>
                      <th className="p-4">Gross Ledger Bounds</th>
                      <th className="p-4">Tendered Settled Balance</th>
                      <th className="p-4">Payment Channel</th>
                      <th className="p-4">Transaction Status</th>
                      <th className="p-4 text-center">Settlements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                    {bills.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-12 text-center text-slate-400 font-medium">No recorded transactions returned within this isolated multi-tenant data space.</td>
                      </tr>
                    ) : (
                      bills.map(bill => {
                        const total = bill.grandTotal || bill.totalAmount || 0;
                        const paid = bill.amountPaid || bill.paidAmount || 0;
                        const balanceRemaining = bill.balanceDue !== undefined ? bill.balanceDue : (total - paid);
                        return (
                          <tr key={bill._id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4">
                              <div className="font-bold text-slate-900 text-sm">{bill.patientId?.name || 'Purged Record'}</div>
                              <div className="text-3xs font-mono text-slate-400 mt-0.5">Bill No: {bill.invoiceNumber || bill._id}</div>
                            </td>
                            <td className="p-4 font-bold text-slate-900 font-mono">₹{total}</td>
                            <td className="p-4 font-mono text-slate-600 space-y-0.5">
                              <div className="text-emerald-600 font-bold">Paid: ₹{paid}</div>
                              {balanceRemaining > 0 && <div className="text-rose-500 text-3xs font-semibold">Bal: ₹{balanceRemaining}</div>}
                            </td>
                            <td className="p-4 font-medium text-slate-600 text-2xs uppercase tracking-wide">{bill.paymentMode}</td>
                            <td className="p-4">
                              <span className={`text-3xs font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                                (bill.paymentStatus === 'Paid' || bill.status === 'Paid') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                (bill.paymentStatus === 'Unpaid' || bill.status === 'Unpaid') ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                              }`}>
                                {bill.paymentStatus || bill.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              {(bill.paymentStatus !== 'Paid' && bill.status !== 'Paid') ? (
                                <button
                                  type="button"
                                  onClick={() => handleSettleAction(bill._id)}
                                  className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 font-bold px-2.5 py-1 text-3xs uppercase tracking-wider rounded transition"
                                >
                                  Clear Balance
                                </button>
                              ) : (
                                <div className="flex items-center justify-center space-x-1.5">
                                  <span className="text-3xs font-mono text-emerald-600 italic font-semibold">Settled</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      window.print();
                                    }}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold px-2 py-0.5 text-3xs uppercase tracking-wider rounded transition flex items-center gap-1"
                                    title="Print Invoice Receipt"
                                  >
                                    🖨️ Print
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default BillingManagement;