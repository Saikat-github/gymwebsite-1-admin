import React, { useContext, useEffect, useState } from 'react';
import { BadgePercent, Plus, Loader2 } from 'lucide-react';
import PlanCard from './PlanCard';
import PlanForm from './PlanForm';
import { addDocument, deleteDocument, getDocuments, updateDocument } from '../../services/firebase/db';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';


const Plans = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loader, setLoader] = useState(false);

  const { loadPlans, plans } = useContext(AuthContext);


  useEffect(() => {
    loadPlans();
  }, []);

  const handleAdd = () => {
    setCurrentPlan(null);
    setModalOpen(true);
  };

  const handleEdit = (plan) => {
    setCurrentPlan(plan);
    setModalOpen(true);
  };

  const handleDelete = async (plan) => {
    if (window.confirm(`Are you sure, you want to delete ${plan.title} plan?`)) {
      await deleteDocument("plans", plan.id);
      loadPlans();
    }
  };

  const handleSubmit = async (data) => {
    setLoader(true);
    try {
          const featuresArray = typeof data.features === 'string'
      ? data.features.split(',').map(f => f.trim())
      : data.features || [];

    if (currentPlan) {
      await updateDocument("plans", currentPlan.id, {
        ...data,
        features: featuresArray
      });
    } else {
      await addDocument("plans",
        {
          ...data,
          features: featuresArray,
          noOfChosen: 0,
        });
    }
    loadPlans();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };



  if (loader) {
    return <div className="bg-slate-900 rounded-xl p-6 shadow-lg max-sm:text-sm">
      <Loader2 className='animate-spin w-6 mx-auto' />
    </div>
  }



  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-lg relative">
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-6">
        <h2 className="text-lg sm:text-2xl font-semibold flex items-center gap-2">
          <BadgePercent className="text-orange-600" /> Membership Plans
        </h2>
        <button onClick={handleAdd} className="cursor-pointer flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-orange-700 transition">
          <Plus size={16} /> Add New Plan
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onEdit={() => handleEdit(plan)}
            onDelete={() => handleDelete(plan)}
          />
        ))}
      </div>

      {modalOpen && (
        <PlanForm
          defaultValues={currentPlan || { title: '', price: '', duration: '', discount: '', features: '' }}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          isEditing={!!currentPlan}
        />
      )}
    </div>
  );
};

export default Plans;
