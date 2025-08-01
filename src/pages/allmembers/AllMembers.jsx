import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getDocuments } from '../../services/firebase/db';
import { Loader2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import SingleMemberCard from './SingleMemberCard';
import SearchBar from './SearchBar';
import Stats from './Stats';
import Filter from './Filter';


const AllMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loader, setLoader] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const { members, setMembers, memberCount } = useContext(AuthContext);
  const { total, maleCount, femaleCount } = memberCount;

  const getAllMembers = async () => {
    try {
      setLoader(true);
      let conditions = [];
      if (searchTerm) {
        conditions.push(
          { field: 'lowerCaseName', operator: '>=', value: searchTerm },
          { field: 'lowerCaseName', operator: '<', value: searchTerm + '\uf8ff' }
        )
      };

      if (statusFilter !== 'all') {
        conditions.push({ field: 'membershipStatus', operator: '==', value: statusFilter });
      }

      const result = await getDocuments('users', null, lastDoc, 20, conditions);
      if (result.success) {
        return result;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };


  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const result = await getAllMembers();
      if (result) {
        setMembers(result.data);
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter]);



  // Load more documents
  const loadMore = async () => {
    if (!hasMore || loader) return;
    const result = await getAllMembers()
    if (result) {
      setMembers(prev => [...prev, ...result.data]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    }
  };



  return (
    <div className="min-h-screen text-white px-4 py-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">All Members</h1>
        <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        <Filter selectedFilter={statusFilter} setStatusFilter={setStatusFilter} />
        <Stats />
      </div>
      <hr className='my-8' />

      {/* Member Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {members?.length > 0 ? (
          members.map((member) => (
            <SingleMemberCard key={member.id} member={member} />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">No members found.</p>
        )}

      </div>

      <div className='flex flex-col items-center justify-center'>
        {
          loader && <Loader2 className='w-8 animate-spin my-4 mx-auto' />
        }
        <button className={`border border-orange-600 cursor-pointer text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto my-4 ${!hasMore && "hidden"}`} onClick={loadMore} disabled={loader}>
          Load More...
        </button>
      </div>
    </div>
  );
};

export default AllMembers;
