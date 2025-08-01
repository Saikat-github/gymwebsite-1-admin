import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { getISTTime } from '../../services/utils/utilFunctions';



const AllAdmins = ({ admins }) => {
  return (
    <div className="rounded-xl p-6 shadow-lg relative max-sm:text-sm flex flex-col justify-around gap-4 items-center bg-slate-900">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <ShieldCheck className="text-orange-600" />
        Current Admins
      </h2>

      {admins && admins.length > 0 ? (
        <div className="space-y-4">
          {admins.map((admin, index) => (
            <div
              key={admin.id || index}
              className="p-2 sm:p-4 border border-slate-400 rounded-lg flex flex-col gap-2 text-sm text-slate-200"
            >
              <p className="font-semibold px-2 py-1 rounded">
                <span>Email -</span> {admin.email}
              </p>
              <p className="font-semibold px-2 py-1 rounded">
                <span>UID -</span> {admin.id}
              </p>
              <p className="font-semibold px-2 py-1 rounded">
                <span>Added At -</span>{' '}
                {admin.createdAt && getISTTime(admin.createdAt)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No admins yet.</p>
      )}
    </div>
  );
};

export default AllAdmins;
