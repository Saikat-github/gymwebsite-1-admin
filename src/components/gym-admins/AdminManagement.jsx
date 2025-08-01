// components/admin/AdminManagement.js
import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../services/firebase/config';
import { UserCog, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase/config';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';



const AdminManagement = ({ getAllAdmins }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const setAdminClaim = httpsCallable(functions, 'setAdminClaim');
  const removeAdminClaim = httpsCallable(functions, 'removeAdminClaim');

  const handleAction = async (actionType) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Enter a valid email address');
      return;
    }
    setLoading(true);

    try {
      if (actionType === 'add') {
        const result = await setAdminClaim({ email });
        const uid = result.data.uid;

        await setDoc(doc(db, 'admins', uid), {
          email,
          createdAt: serverTimestamp(),
        });

        toast.success('✅ Admin added.');
      } else {
        const result = await removeAdminClaim({ email });
        const uid = result.data.uid;

        await deleteDoc(doc(db, 'admins', uid));
        toast.success('❌ Admin removed.');
      }
    } catch (error) {
      console.log(error);
      toast.error('⚠️ ' + error.message);
    } finally {
      setEmail('');
      setLoading(false);
      getAllAdmins()
    }
  };



  return (
    <div className='rounded-xl p-6 shadow-lg relative max-sm:text-sm bg-slate-900'>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 justify-center"><UserCog size={24} className="text-orange-600" />Manage Admins</h2>
      <div className=" flex flex-col sm:flex-row justify-around gap-10 items-center">
        <div className='max-w-72'>
          <div className='text-xs space-y-4'>
            <Link
              to={"/admin/gyminfo"}
              className="flex gap-1 cursor-pointer transition-all duration-200 bg-black/60 w-20 px-2 py-1.5 text-slate-200 rounded hover:opacity-80"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <p className='text-sm font-semibold'>N.B :</p>
            <li>Enter a registered email to add/remove anyone as an admin.</li>
            <li>User must be signed up or logged in atleast once on the user panel of this website. </li>
            <li>Once added, an admin can manage everything, from admission management to user deletion to payment management.</li>
            <li>Be extra careful while adding a new admin</li>
          </div>
        </div>

        <div className='flex flex-col gap-6 justify-center' >
          {
            loading
              ?
              <Loader2 className='w-6 animate-spin mx-auto' />
              :
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email . . . "
                className="px-3 py-1.5 border border-slate-300 rounded focus:outline-none text-sm"
              />
          }

          <div className="flex gap-4 text-xs">
            <button
              onClick={() => handleAction('add')}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 disabled:opacity-60 cursor-pointer transition-all duration-200"
            >
              Add Admin
            </button>

            <button
              onClick={() => handleAction('remove')}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-60 cursor-pointer transition-all duration-200"
            >
              Remove Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
