import React, { useContext, useEffect, useState } from 'react'
import HistoryCard from './HistoryCard';
import { User, CalendarClock, Info, Loader2, Clock } from "lucide-react";
import { getDocuments } from '../../../services/firebase/db';
import { toast } from 'react-toastify';
import { getISTTime } from "../../../services/utils/utilFunctions";



const Memberships = ({member}) => {
  const [documents, setDocuments] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loader, setLoader] = useState(true)



  useEffect(() => {
    const getMembershipHistory = async () => {
      try {
        setLoader(true)
        const result = await getDocuments('memberships', member.userId);
        if (result.success) {
          setDocuments(result.data);
          setLastDoc(result.lastDoc);
          setHasMore(result.hasMore);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoader(false);
      }
    }

    getMembershipHistory()
  }, [])


  // Load more documents
  const loadMore = async () => {
    if (!hasMore || loader) return;

    try {
      setLoader(true);
      const result = await getDocuments('memberships', member.userId, lastDoc);
      if (result.success) {
        setDocuments(prev => [...prev, ...result.data]);
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error loading more documents:", error);
    } finally {
      setLoader(false);
    }
  };


  return (
    <div className="">
       <h1 className='text-center text-xl mb-2 px-4 py-1 rounded bg-slate-200 text-slate-900 sm:w-60 mx-auto'>Membership Info</h1>
      {member?.membershipStatus === "inactive" ? (
        <div className="text-xs p-2 rounded max-w-2xl text-center mx-2 sm:mx-auto flex items-center justify-center gap-2 text-red-600 my-2">
          <Info />
          <p className='text-gray-400 text-sm'>
            This member doesn't have any active membership, {member.endDate && ` membership expired on ${getISTTime(member?.endDate)}`}
          </p>
        </div>
      )
        :
        <div className='flex flex-col gap-1 items-center my-4 text-sm'>
          <p className='flex gap-1 sm:items-center'><User className='w-5 text-orange-600' />Membership : Active</p>
          <p className='flex gap-1 sm:items-center'><Clock className='w-5 text-orange-600' />Last Payment On : {getISTTime(member?.lastPaymentDate)}</p>
          <p className='flex gap-1 sm:items-center'><CalendarClock className='w-5 text-orange-600' />Expires on : {getISTTime(member?.endDate)}</p>
        </div>
      }

      <div>
        <h1 className='text-center text-xl'>History</h1>
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
          {
            documents?.length === 0 ? (
              <div className="text-center text-gray-400 text-sm">
                No membership history found.
              </div>
            )
              :
              documents?.map((membership, index) => (
                <HistoryCard key={index} membership={membership} name={member?.firstName + " " + member?.lastName} />
              ))
          }
        </div>
        {
          loader && <Loader2 className='w-8 animate-spin my-10 mx-auto' />
        }
        <button className={`border border-orange-600 cursor-pointer text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto my-4 ${!hasMore && "hidden"}`} onClick={loadMore} disabled={loader}>
          Load More...
        </button>
      </div>
    </div>

  )
}

export default Memberships