import { Plans, ScheduleForm } from '../components';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const GymInfo = () => {

  const navigate = useNavigate();
  return (
    <div className="py-10 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center mb-8">Gym Management</h1>
        <button 
        onClick={() => navigate("/admin/manage-admins")} className='border border-orange-600 px-3 py-1 rounded flex gap-2 items-center cursor-pointer hover:opacity-80 transition duration-200 mx-auto'>Manage Admins <ArrowRight className='w-5'/></button>
        <ScheduleForm />
        <Plans />
      </div>
    </div>
  );
};

export default GymInfo;
