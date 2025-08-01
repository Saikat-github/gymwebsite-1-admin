import React, { useContext } from 'react'
import { Users, User, UserRound } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';


const Stats = () => {
  const { memberCount } = useContext(AuthContext)
  const { total, maleCount, femaleCount } = memberCount;


  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-sm">

      <div className="flex items-center gap-2">
        <Users className="text-orange-600" />
        <span>Total Members: <strong>{total}</strong></span>
      </div>
      <div className='flex gap-3'>
        <div className="flex items-center gap-1">
          <User className="text-orange-600" />
          <span>Male: <strong>{maleCount}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <UserRound className="text-orange-600" />
          <span>Female: <strong>{femaleCount}</strong></span>
        </div>
      </div>
    </div>
  )
}

export default Stats