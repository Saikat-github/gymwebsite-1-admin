import { User } from 'lucide-react';
import { Link } from 'react-router-dom';


const convertGMTToIST = (gmtDateString) => {
    const date = new Date(gmtDateString);
    if (isNaN(date)) throw new Error("Invalid GMT date string");

    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        timeZoneName: 'short'
    });
};



const SingleUser = ({ user }) => {
    return (
        <div
            className="bg-slate-900 rounded-xl transition duration-300 p-4 text-center text-sm flex flex-col gap-1 text-gray-200"
        >
            <div className="flex justify-center">
                <User className="text-orange-600" size={40} />
            </div>
            <h2 className="font-semibold mb-1">{user.email}</h2>
            <h2 className="font-semibold mb-1">{user.displayName}</h2>
            <p className="text-gray-300">Created On : {convertGMTToIST(user.creationTime)}</p>
            <p className="text-gray-300">Last Login : {convertGMTToIST(user.lastSignInTime)}</p>
            <p className="text-gray-300">Is Admin: {user.customClaims.admin ? "Yes" : "No"}</p>
            <Link
                to={`/admin/members/${user.uid}`}
                className="inline-block mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition mx-auto"
            >
                View Member Profile
            </Link>
        </div>
    )
}

export default SingleUser