import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Users, CreditCard, Dumbbell, UserCog, Ticket, Menu, X } from 'lucide-react';
import Logout from './auth/Logout';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { isAdmin } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { show: isAdmin, name: 'Home', to: "/", icon: <Home className='w-5 text-orange-600' /> },
    { show: isAdmin, name: 'Members', to: '/admin/members', icon: <Users className='w-5 text-orange-600' /> },
    { show: isAdmin, name: 'Registered Users', to: '/admin/users', icon: <UserCog className='w-5 text-orange-600' /> },
    { show: isAdmin, name: 'Gym Info', to: '/admin/gyminfo', icon: <Dumbbell className='w-5 text-orange-600' /> },
    { show: isAdmin, name: 'Day-Passes', to: '/admin/day-passes', icon: <Ticket className='w-5 text-orange-600' /> },
    { show: isAdmin, name: 'Payments', to: '/admin/payments', icon: <CreditCard className='w-5 text-orange-600' /> },
  ];

  return (
    <>
      {/* Toggle button (visible on small screens) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-950 text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} className='' />}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-slate-950 text-white h-screen w-64 fixed top-0 left-0 shadow-md shadow-slate-300 flex flex-col z-40 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo */}
        <Link to={"/"} className="flex items-center px-6 py-6 space-x-2 border-b border-gray-700">
          <Dumbbell className="text-red-600" size={28} />
          <span className="font-bold text-xl tracking-wide">Gym Admin</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {navItems.map((item) => (
            item.show && (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setIsOpen(false)} // close sidebar on nav click (mobile)
                className={({ isActive }) =>
                  `text-sm flex items-center gap-3 px-3 py-2 rounded transition hover:bg-slate-800 
                  ${isActive ? "bg-slate-800 border-l-4 border-orange-600" : ""}`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            )
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <Logout isAdmin={isAdmin} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
