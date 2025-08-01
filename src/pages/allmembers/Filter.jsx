import React from 'react';

const Filter = ({ selectedFilter, setStatusFilter }) => {
  return (
    <div className="flex gap-3 items-center justify-center mb-6 flex-wrap text-sm">
      <label className="">Filter by Membership Status:</label>
        <select
            value={selectedFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded px-3 py-1 bg-slate-800 text-gray-200 outline-none"
        >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="terminated">Terminated</option>
        </select>
    </div>
  );
};

export default Filter;
