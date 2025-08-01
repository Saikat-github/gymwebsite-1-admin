import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ActionButtons, MemberInfo, Memberships } from '../components';
import { Loader2 } from 'lucide-react';
import { getDocuments } from '../services/firebase/db';



const SingleMember = () => {
  const [loader, setLoader] = useState(false);
  const { userId } = useParams();
  const [selectedMember, setSelectedMember] = useState(null)


  const getSingleMember = async () => {
    try {
      setLoader(true)
      const result = await getDocuments(
        'users',
        userId,
      );
      if (result.success) {
        setSelectedMember(result.data[0])
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    getSingleMember()
  }, [])


  if (loader) {
    return <div className='flex justify-center items-center h-60'>
      <Loader2 className='animate-spin mx-auto w-5' />
    </div>
  }

  return (
    <div className="min-h-screen sm:py-10 sm:px-6">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-6 shadow-lg space-y-10 md:space-y-16 max-sm:text-sm">
        {selectedMember ?
         <>
          <MemberInfo member={selectedMember} />
          <hr />
          <ActionButtons
            getSingleMember={getSingleMember}
            member={selectedMember} />
          <hr />
          <Memberships member={selectedMember} />
        </>
        :
        <p className='my-20 text-center text-gray-400'>No member found associated to this user!</p>
        }
      </div>
    </div>
  );
};

export default SingleMember;
