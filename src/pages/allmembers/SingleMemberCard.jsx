import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Dot } from 'lucide-react'



const SingleMemberCard = ({ member }) => {
  return (
    <Link
      key={member.userId}
      to={`/admin/members/${member.userId}`}
      className="bg-slate-900 rounded-xl transition-all duration-300 overflow-hidden flex p-2 text-slate-200 hover:opacity-85"
    >
      <div>
        <img
          src={member?.imageUrl?.secure_url}
          alt={member.name}
          className="w-30 h-30 object-cover rounded-full"
        />
        <p className={`flex items-center gap-1 text-center text-sm mt-2  rounded-full ${member.membershipStatus === 'active' ? "text-green-700" : "text-red-700"}`}><Dot /> {member.membershipStatus}</p>
      </div>
      <div className="p-4">
        <h2 className="text-sm lg:text-xl font-semibold mb-1">{member.name}</h2>
        <p className="text-gray-400">Age: {member.age}</p>
        <p className='flex gap-1 items-center text-xs'>View Details <ArrowRight size={20} className='my-2' /></p>
      </div>
    </Link>
  )
}

export default SingleMemberCard