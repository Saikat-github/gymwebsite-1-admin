import React from 'react'
import { Search, X } from 'lucide-react'

const SearchUser = ({ setEmail, email, fetchAllUsers }) => {
    return (
        <div className="mb-6 relative max-w-md mx-auto text-xs sm:text-sm w-full  rounded-lg bg-slate-900 text-slate-200 outline-none flex items-center justify-between">
            <input
                type="text"
                placeholder="Search by email (enter complete email)..."
                className="w-full outline-none px-4 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {email && <X className='w-5 cursor-pointer' onClick={() => setEmail('')} />}
            <button
            // disabled={email === ''}
            onClick={() => fetchAllUsers()}
            className={`bg-orange-600 py-2 px-2 rounded-br-lg rounded-tr-lg ml-2 cursor-pointer`}>Search</button>
        </div>
    )
}

export default SearchUser