import React from 'react';

const PlanList = ({ plans, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {plans.length === 0 ? (
        <div className="col-span-1 md:col-span-4 bg-white p-6 text-center text-gray-500 rounded shadow-md">
          No cloud service plan subscription vectors configured yet. Initialize templates above.
        </div>
      ) : (
        plans.map((plan) => (
          <div key={plan._id} className="bg-white rounded-lg shadow-md p-6 border flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {plan.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-gray-900">₹{plan.price}</span>
                <span className="text-gray-500 text-sm"> / {plan.billingCycle}</span>
              </div>
              
              <ul className="mt-4 space-y-2 border-t pt-4 text-sm text-gray-600">
                <li>👥 Staff limit: <strong>{plan.limits?.staffLimit === -1 ? 'Unlimited' : plan.limits?.staffLimit}</strong></li>
                <li>🩸 Patient cap: <strong>{plan.limits?.patientLimit === -1 ? 'Unlimited' : plan.limits?.patientLimit}</strong></li>
                <li>💾 Cloud space: <strong>{plan.limits?.storageLimitGb} GB</strong></li>
              </ul>

              {plan.features && plan.features.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Features Included:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {plan.features.map((feat, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2 border-t pt-4">
              <button
                onClick={() => onEdit(plan)}
                className="flex-1 bg-blue-50 text-blue-600 text-center py-2 rounded text-sm font-semibold hover:bg-blue-100 transition"
              >
                Modify
              </button>
              <button
                onClick={() => onDelete(plan._id)}
                className="bg-red-50 text-red-600 p-2 rounded text-sm font-semibold hover:bg-red-100 transition"
              >
                Purge
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PlanList;