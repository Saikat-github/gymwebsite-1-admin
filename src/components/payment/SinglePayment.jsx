import React from 'react';
import { Eye, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getISTTime } from '../../services/utils/utilFunctions';

const SinglePayment = ({ payment }) => {
  const navigate = useNavigate();

  const handleBtnClicked = () => {
    if (payment.planId === "day-pass") {
      navigate(`/admin/day-passes/${payment.dayPassId}`);
    } else {
      navigate(`/admin/members/${payment.userId}`);
    }
  };

  return (
    <div className="bg-slate-900 p-5 rounded-xl shadow-md flex flex-col sm:flex-row gap-2 sm:gap-6 max-sm:items-center justify-between max-w-xl text-sm">
      <div className="flex flex-col gap-3 justify-between text-sm text-gray-300">
        <div className='space-y-1'>
          <h2 className="text-xl font-bold text-orange-600">₹{payment.amount} | {payment.planId}</h2>
          <p className="">Payment Date: {getISTTime(payment.createdAt)}</p>
          <p>Status : {payment.status === "completed" ? "Completed" : "Pending"}</p>
          <p>Order Id : {payment.orderId}</p>
          <p>Payment Id : {payment.paymentId}</p>
          <p></p>
        </div>

        <div className="flex gap-3 text-xs sm:text-sm">
          <button
            onClick={handleBtnClicked}
            className="bg-black/60 cursor-pointer px-3 py-1.5 text-gray-300 flex items-center gap-1 hover:opacity-80 transition-opacity duration-200 rounded"
          >
            <Eye size={16} className='text-orange-600' />{payment.dayPassId ? 'View Day Pass' : 'View Member'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SinglePayment;
