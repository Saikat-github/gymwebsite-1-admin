import React from 'react'
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getDocumentById } from '../../services/firebase/db';
import { toast } from 'react-toastify';
import SingleDayPass from '../../components/SingleDayPass';





const SinglePass = () => {
  const [loader, setLoader] = useState(false);
  const { id } = useParams();
  const [selectedPass, setSelectedPass] = useState(null)

  const getSinglePass = async () => {
    try {
      setLoader(true)
      const result = await getDocumentById(
        'dayPasses',
        id
      );
      console.log(result);
      if (result.success) {
        setSelectedPass(result.data)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    getSinglePass()
  }, [])


  if (loader) {
    return <div className='flex justify-center items-center h-60'>
      <Loader2 className='animate-spin mx-auto w-5' />
    </div>
  }



  return (
    selectedPass ? (
      <div className='flex flex-col gap-2 justify-center items-center p-4'>
        <h1 className='text-2xl text-center'>Single Day Pass Details</h1>
        <SingleDayPass pass={selectedPass} /> 
      </div>
    ) : (
      <div className='flex justify-center items-center h-60'>
        <p className='text-slate-500'>No Pass Found</p>
      </div>
    ))
}

export default SinglePass