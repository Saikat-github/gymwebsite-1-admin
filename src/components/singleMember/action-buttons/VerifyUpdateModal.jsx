import { Loader2, X } from 'lucide-react'
import React, { useState } from 'react'
import { updateDocument } from '../../../services/firebase/db'
import { toast } from 'react-toastify'
import { calculateEndDate } from '../../../services/utils/utilFunctions'



const VerifyUpdateModal = ({ member, onClose, getSingleMember }) => {
    const [days, setDays] = useState(0)
    const [loader, setLoader] = useState(false);


    const update = async (action) => {
        try {
            setLoader(true);

            if (action === "verify") {
                const result = await updateDocument("users", member.id, { verified: !member.verified });
                if (result.success) {
                    toast.success("Updated successfully")
                }
            } else if (action === "membership-update") {
                if (!days || days <= 0) {
                    toast.error("Please enter a valid number of days");
                    return;
                }
                const endDate = calculateEndDate(days, member.endDate);
                const result1 = await updateDocument("users", member.id, { endDate });
                const result2 = await updateDocument("memberships", member.currentmembershipId, { endDate })
                if (result1.success && result2.success) {
                    toast.success("Membership updated successfully")
                } else {
                    toast.error("Failed to update membership")
                }
            }
        } catch (error) {
            toast.error("An error occurred while updating");
        } finally {
            getSingleMember()
            setLoader(false);
            onClose();
        }
    }


    if (loader) {
        return (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
                <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md relative text-slate-300 space-y-4">
                    <p className='text-center flex items-center justify-center gap-2'>
                        <Loader2 className='w-5 animate-spin' />
                        Processing...</p>
                </div>
            </div>
        )
    }


    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md relative text-slate-300 space-y-4">
                <X className='w-5 cursor-pointer absolute top-1 right-4' onClick={onClose} />
                <button
                    disabled={loader}
                    className='bg-orange-700 rounded px-3 py-1 flex items-center justify-center gap-2 cursor-pointer mx-auto hover:opacity-80'
                    onClick={() => update("verify")}>
                    {member.verified ? "Revoke Verification" : "Verify Member"}
                </button>
                <p className='text-center'>Or</p>
                {
                    member.currentmembershipId
                        ?
                        <div className='flex flex-col gap-4 items-center bg-slate-800 rounded-lg p-2'>
                            <h2 className=''>Update membership duration</h2>
                            <div className='flex flex-col items-center gap-2'>
                                <label>Enter number of days</label>
                                <input
                                    value={days}
                                    type="number"
                                    placeholder=''
                                    className='px-4 py-2 bg-slate-700 outline-none text-sm w-24'
                                    minLength={0}
                                    onChange={(e) => setDays(e.target.value)}
                                    required />
                            </div>
                            <button
                                className='bg-orange-700 rounded px-3 py-1.5 flex items-center justify-center gap-2 cursor-pointer hover:opacity-80'
                                onClick={() => update("membership-update")}
                                disabled={loader}>
                                Increase
                            </button>
                        </div>
                        :
                        <p className='text-slate-400 text-center'>Member doesn't have any active membership to update</p>
                }
            </div>
        </div>
    )
}

export default VerifyUpdateModal