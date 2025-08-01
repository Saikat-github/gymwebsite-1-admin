import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase/config';
import { signOut, onAuthStateChanged } from '../services/firebase/auth';
import { toast } from 'react-toastify';
import { getNumberOfDocuments, getDocuments } from '../services/firebase/db';



export const AuthContext = createContext(null);


const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState(null);
  const [plans, setPlans] = useState([]);
  const [popularPlans, setPopularPlans] = useState([]);
  const [memberCount, setMemberCount] = useState({ total: 0, maleCount: 0, femaleCount: 0 })
  const [totalUsers, setTotalUsers] = useState(0);



  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);

        // 👇 Fetch custom claims (or from Firestore if you store roles there)
        const tokenResult = await currentUser.getIdTokenResult(true);
        const claims = tokenResult.claims;

        if (claims.superAdmin || claims.admin) {
          // ✅ User is an admin or super admin
          setIsSuperAdmin(claims.superAdmin || false);
          setIsAdmin(claims.admin || false);
          await getMemberCount();
          await loadPlans();
        } else {
          // ❌ Not an admin, sign them out immediately
          try {
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
            alert('Unauthorized access. You have been signed out.');

          } catch (error) {
            toast.error('Error signing out unauthorized user: ' + error.message);
          }
        }
      } else {
        // No user signed in
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });


    return () => unsubscribe();
  }, []);



  const getMemberCount = async () => {
    try {
      const getTotalMembers = await getNumberOfDocuments("users", null, [
      ])
      const getTotalMale = await getNumberOfDocuments("users", null, [
        { field: "gender", operator: "==", value: "Male" }
      ]
      )
      const getTotalFemale = await getNumberOfDocuments("users", null, [
        { field: "gender", operator: "==", value: "Female" }
      ]
      )
      setMemberCount({
        total: getTotalMembers,
        maleCount: getTotalMale,
        femaleCount: getTotalFemale
      })

    } catch (error) {
      console.error("Error fetching member count: ", error);
    }
  }



  const loadPlans = async () => {
    try {
      const result = await getDocuments("plans");
      if (result.data) {
        setPlans(result.data);
        const maxChosen = result.data.length > 0 ? Math.max(...result.data.map(plan => plan.noOfChosen)) : 0;
        setPopularPlans(result.data.filter(plan => plan.noOfChosen === maxChosen))
      }
    } catch (error) {
      toast.error(error.message)
    }
  };


  const value = {
    user,
    isAdmin,
    isSuperAdmin,
    loading,
    members,
    setMembers,
    memberCount,
    plans,
    loadPlans,
    popularPlans,
    totalUsers,
    setTotalUsers
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
