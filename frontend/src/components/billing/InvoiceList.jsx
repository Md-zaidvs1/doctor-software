import React from 'react';

const InvoiceList = ({ invoices, onViewInvoice, onDelete }) => {
  return (
    <div className="bg-white rounded shadow-md overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b text-xs font-bold uppercase text-gray-700">
            <th className="p-3">Invoice Code</th>
            <th className="p-3">Patient Profile</th>
            <th className="p-3">Financial Total</th>
            <th className="p-3">Paid Ledger</th>
            <th className="p-3">Outstanding Balance</th>
            <th className="p-3">Status State</th>
            <th className="p-3 text-right">Actions Matrix</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-4 text-center text-gray-500 text-sm">No synchronized statement ledgers found inside current partition nodes.</td>
            </tr>
          ) : (
            invoices.map((inv) => (
              <tr key={inv._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-3 font-mono font-bold text-xs text-purple-700">{inv.invoiceNumber}</td>
                <td className="p-3">
                  <div className="font-semibold text-gray-900">{inv.patientId?.name || 'Purged File'}</div>
                  <div className="text-xs text-gray-400 font-mono">{inv.patientId?.patientId}</div>
                </td>
                <td className="p-3 font-semibold">₹{inv.grandTotal}</td>
                <td className="p-3 text-green-700 font-medium">₹{inv.amountPaid} <div className="text-2xs text-gray-400 font-normal">via {inv.paymentMode}</div></td>
                <td className="p-3 text-red-600 font-bold">₹{inv.balanceDue}</td>
                <td className="p-3">
                  <span className={`text-2xs px-2 py-0.5 rounded font-black tracking-wide uppercase ${
                    inv.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                    inv.paymentStatus === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {inv.paymentStatus}
                  </span>
                </td>
                <td className="p-3 text-right text-xs font-bold space-x-2">
                  <button onClick={() => onViewInvoice(inv._id)} className="text-emerald-600 hover:underline">View & Transact</button>
                  <button onClick={() => onDelete(inv._id)} className="text-red-600 hover:underline">Purge</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;