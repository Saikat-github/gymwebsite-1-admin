import React from 'react';
import { Pencil, Trash2, IndianRupee } from 'lucide-react';



const capitalizeFirstLetter = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";



const PlanCard = ({ plan, onEdit, onDelete }) => {
    return (
        <div className={`relative bg-slate-800 rounded-lg p-5 shadow-md ${plan.popular === "yes" ? 'border border-orange-500' : ''}`}>
            {plan.popular === "yes" && (
                <span className="absolute top-0 left-0 bg-orange-600 text-xs px-2 py-0.5 rounded-br-lg rounded-tl-lg text-white">
                    Most Popular
                </span>
            )}
            <div className="absolute top-2 right-2 flex gap-3">
                <button onClick={onEdit} className=" cursor-pointer text-orange-500 hover:text-orange-300">
                    <Pencil size={16} />
                </button>
                <button onClick={onDelete} className="cursor-pointer text-red-600 hover:text-red-400">
                    <Trash2 size={16} />
                </button>
            </div>
            <div className='space-y-3 sm:space-y-6 text-sm'>
                <h3 className=" font-bold text-lg text-orange-500 mb-1">{capitalizeFirstLetter(plan?.title)}</h3>
                <p className=" text-gray-200 mb-1">Price : ₹{plan?.price}</p>
                <p className=" text-gray-200 mb-2">Duration : {plan?.duration} days</p>
                <p className=" text-gray-200 mb-2">No of Times Choosen : {plan?.noOfChosen} </p>
                {plan?.discount && (
                    <p className="text-xs text-green-400 italic mb-2 flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" /> {plan?.discount}
                    </p>
                )}
                <ul className="text-sm text-gray-200">
                    {plan?.features.map((feature, i) => (
                        <li key={i}>- {feature}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PlanCard;
