import React from 'react';
import { Ghost } from 'lucide-react';
import { Link } from 'react-router-dom'; // optional if using React Router

const NotFound = () => {
  return (
    <div className="min-h-screen text-white flex flex-col items-center px-4 mt-10">
      <Ghost className="w-16 h-16 text-zinc-400 mb-6" />
      <h1 className="text-4xl font-semibold mb-2">404</h1>
      <p className="text-lg text-zinc-400 mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="px-4 py-2 rounded-full transition-colors text-sm text-white border border-orange-600 hover:bg-orange-600"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
