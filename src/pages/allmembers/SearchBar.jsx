import React from 'react'
import { Search, X } from 'lucide-react'

const SearchBar = ({ setSearchTerm, searchTerm }) => {
    return (
        <div className="mb-4 relative max-w-md mx-auto text-sm w-full px-4 py-2 rounded-lg bg-slate-900 text-slate-200 outline-none flex items-center justify-between">
            <input
                type="text"
                placeholder="Search by name..."
                className="w-full outline-none pr-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className='flex items-center gap-2'>
                {searchTerm && <X className='w-5' onClick={() => setSearchTerm('')}/>}
                <Search className="w-5" />
            </div>
        </div>
    )
}

export default SearchBar