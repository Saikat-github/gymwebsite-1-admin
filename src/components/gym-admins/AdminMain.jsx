import React, { useEffect, useState } from 'react'
import AdminManagement from './AdminManagement'
import AllAdmins from './AllAdmins'
import { getDocuments } from '../../services/firebase/db';
import { toast } from 'react-toastify';


const AdminMain = () => {
  const [admins, setAdmins] = useState(null);
  const [loader, setLoader] = useState(false);


  const getAllAdmins = async () => {
    try {
      setLoader(true)
      const result = await getDocuments("admins");
      if (result.data) {
        setAdmins(result.data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    getAllAdmins()
  }, [])


  return (
    <div className='space-y-4 max-sm:py-4 sm:p-4'>
      <AdminManagement getAllAdmins={getAllAdmins} />
      <AllAdmins admins={admins} />
    </div>
  )
}

export default AdminMain