import React, { useState, useEffect, useContext } from 'react';
import { SearchUser, SingleUser } from '../components';
import { functions } from '../services/firebase/config';
import { httpsCallable } from 'firebase/functions';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';



const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [singleUser, setSingleUser] = useState(null);

  const { totalUsers, setTotalUsers} = useContext(AuthContext);


  const getAllUsers = httpsCallable(functions, 'getAllUsers')
  const getUserByEmail = httpsCallable(functions, 'getUserByEmail')


  const fetchAllUsers = async () => {
    try {
      setLoader(true);
      let result;

      // Strong email validation regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (email !== '') {
        if (!emailRegex.test(email)) {
          toast.error("Please enter a valid email address.");
          return;
        }
        result = await getUserByEmail({ email: email });
      } else {
        result = await getAllUsers();
      }

      const { data } = result;
      if (data.success) {
        setSingleUser(data.user || null);
        setEmail('');
        setUsers(data.users);
        setTotalUsers(data.total);
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };



  useEffect(() => {
    fetchAllUsers()
  }, []);


  return (
    <div className="min-h-screen bg-slate-950 text-gray-300 px-4 py-10">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">All Registered Users</h1>
        <SearchUser
          fetchAllUsers={fetchAllUsers}
          email={email}
          setEmail={setEmail} />
      </div>


      {/* Loader */}
      {
        loader && <Loader2 className='w-8 animate-spin my-4 mx-auto' />
      }

      {/* Single User */}
      {
        singleUser && (
          <div className="max-w-6xl mx-auto mb-8">
            <SingleUser user={singleUser} />
          </div>
        )
      }

      {/* Total Users */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Total Users : {totalUsers}</h2>
      </div>

      {/* All Users */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {users?.length > 0 ? (
          users.map((user) => (
            <SingleUser user={user} key={user.uid} />
          ))
        ) : (
          !singleUser && (
            <div className="col-span-full text-center text-gray-500">
              No users found.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllUsers;
