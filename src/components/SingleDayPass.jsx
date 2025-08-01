import { BadgeCheck, XCircle } from 'lucide-react';
import { getISTTime, findExpiration } from '../services/utils/utilFunctions';
import { updateDocument } from '../services/firebase/db';
import { toast } from 'react-toastify';
import { useState } from 'react';



const SingleDayPass = ({ pass, loadDayPasses }) => {
    const [loader, setLoader] = useState(false);

    const MarkAsAvailed = async () => {
        try {
            setLoader(true);
            if (pass.availed) {
                toast.error("This pass is already marked as availed");
                return;
            }
            const result = await updateDocument("dayPasses", pass.id, { availed: true });
            if (result.success) {
                await loadDayPasses();
            } else {
                toast.error("Failed to mark as availed");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoader(false);
        }
    }




    return (
        <div className="bg-slate-800 rounded-2xl shadow-md p-6 w-full max-w-3xl mx-auto hover:shadow-lg transition-shadow duration-300 text-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 gap-2 ">
                <h2 className="text-xl font-semibold">{pass.name} ({pass.age} yo)</h2>

                {findExpiration(pass.endDate) < 0 ? <span className='bg-red-600 `text-sm px-3 py-1 rounded '>Expired</span> : <span className='bg-green-600 `text-sm px-3 py-1 rounded '>Active</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
                <div><span className="font-semibold text-slate-200">Phone :</span> {pass.phone}</div>
                <div><span className="font-semibold text-slate-200">Email :</span> {pass.email}</div>
                <div><span className="font-semibold text-slate-200">Amount :</span> ₹{pass.amount}</div>
                <div><span className="font-semibold text-slate-200">Payment Status :</span> {pass.payment}</div>
                <div><span className="font-semibold text-slate-200">Payment Method :</span> {pass.paymentMethod}</div>
                <div><span className="font-semibold text-slate-200">No. of Days :</span> {pass.noOfDays}</div>
                <div><span className="font-semibold text-slate-200">Order ID :</span> {pass.orderId}</div>
                <div><span className="font-semibold text-slate-200">Payment ID :</span> {pass.paymentId}</div>
                <div><span className="font-semibold text-slate-200">Booked On :</span> {getISTTime(pass.createdAt)}</div>
                <div><span className="font-semibold text-slate-200">Expires On :</span> {getISTTime(pass.endDate)}</div>
                <div><span className="font-semibold text-slate-200">Payment Date :</span> {getISTTime(pass.paymentDate)}</div>
                <div><span className="font-semibold text-slate-200">Updated At :</span> {getISTTime(pass.updatedAt)}</div>
            </div>

            <div className="mt-6 mb-2 flex flex-col gap-2 text-sm">
                <div className='text-slate-300'><span className="font-semibold text-slate-200">User Id :</span> {pass.userId}</div>
                <span className="flex items-center gap-1">
                    {pass.terms ? (
                        <>
                            <BadgeCheck className="text-green-500 w-4 h-4" /> Terms Accepted
                        </>
                    ) : (
                        <>
                            <XCircle className="text-red-500 w-4 h-4" /> Terms Not Accepted
                        </>
                    )}
                </span>
            </div>


            {
                pass.availed
                    ?
                    <span className='text-sm px-4 py-2 rounded bg-black'>Pass availed</span>
                    :
                    <button
                        onClick={() => MarkAsAvailed()}
                        className='text-sm py-2 px-4 bg-black my-2 hover:opacity-50 cursor-pointer transition duration-300'>{
                            loader ? "Marking as availed..." : "Mark as Availed"
                        }
                    </button>
            }
        </div>
    );
};

export default SingleDayPass;
