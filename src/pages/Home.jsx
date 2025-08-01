import React, { useContext } from 'react';
import { Users, UserCog, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { memberCount, popularPlans, totalUsers } = useContext(AuthContext);

  const cards = [
    {
      title: "Total Members",
      value: memberCount.total,
      icon: <Users className="text-orange-600" size={32} />,
      link: "/admin/members",
    },
    {
      title: "Registered Users",
      value: totalUsers,
      icon: <UserCog className="text-orange-600" size={32} />,
      link: "/admin/users",
    },
    {
      title: "Popular Plan",
      value: popularPlans?.length > 0 ? popularPlans[0].title.toUpperCase() : "No plans available",
      icon: <Crown className="text-orange-600" size={32} />,
      link: "/admin/gyminfo",
    },
  ];


  return (
    <div className=" py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className={`rounded-2xl p-6 shadow-lg hover:scale-105 transform transition duration-300 bg-slate-900 flex flex-col justify-between text-gray-300`}
          >
            <div className="flex items-center gap-4 mb-4">
              {card.icon}
              <h2 className="text-xl font-semibold">{card.title}</h2>
            </div>
            <div className="text-2xl font-bold">
              {card.value}
            </div>
            <p className="text-sm mt-2 text-gray-400 flex items-center gap-1">View Details <ArrowRight className='w-4' /></p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
