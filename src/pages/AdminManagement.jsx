import React, { useContext } from 'react'
import { AdminMain } from '../components'
import { AuthContext } from '../context/AuthContext';
import { UserCog } from 'lucide-react';



const AdminManagement = () => {
  const {isSuperAdmin} = useContext(AuthContext);

    // Check if the user is a super admin
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center  my-32 h-screen p-2">
        <UserCog size={48} className="text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold text-center">Access Denied</h2>
        <p className="text-gray-600 mt-2 text-center">You do not have permission to manage admins.</p>
        <p className="text-gray-600 mt-2 text-center">Please contact a super admin for assistance.</p>
      </div>
    );
  }


  return (
    <AdminMain />
  )
}

export default AdminManagement