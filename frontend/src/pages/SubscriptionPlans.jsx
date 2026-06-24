import React, { useState, useEffect } from 'react';
import PlanForm from '../components/subscriptionPlans/PlanForm';
import PlanList from '../components/subscriptionPlans/PlanList';
import { subscriptionPlanService } from '../services/subscriptionPlanService';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await subscriptionPlanService.getPlans();
      if (res.success) {
        setPlans(res.data);
      } else {
        setError(res.message || 'Error processing plan templates.');
      }
    } catch (err) {
      setError('System structural connection validation fault.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      let result;
      if (currentPlan) {
        result = await subscriptionPlanService.updatePlan(currentPlan._id, formData);
      } else {
        result = await subscriptionPlanService.createPlan(formData);
      }

      if (result.success) {
        setCurrentPlan(null);
        loadPlans();
      } else {
        alert(result.message || 'Execution error writing metrics template properties.');
      }
    } catch (err) {
      alert('Internal network routing conflict occurred.');
    }
  };

  const handleEdit = (plan) => {
    setCurrentPlan(plan);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you absolutely certain you want to purge this global monetization structural tier asset?')) {
      try {
        const result = await subscriptionPlanService.deletePlan(id);
        if (result.success) {
          loadPlans();
        } else {
          alert(result.message);
        }
      } catch (err) {
        alert('Internal operational database fault.');
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">SaaS Monetization & Limit Configuration Matrix</h2>
        <p className="text-sm text-gray-500">Govern access tiers, control strict operational ceilings, and features accessibility sets.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <PlanForm
        currentPlan={currentPlan}
        onFormSubmit={handleFormSubmit}
        onCancel={() => setCurrentPlan(null)}
      />

      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-700 mb-3">Live System Plan Tiers</h3>
        {loading ? (
          <div className="text-center font-medium text-gray-600">Syncing active metric frameworks...</div>
        ) : (
          <PlanList plans={plans} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;