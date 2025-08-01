import {
    ShieldCheck, Trash2,
    Image as ImageIcon,
} from 'lucide-react';
import { useState } from 'react';
import VerifyUpdateModal from './VerifyUpdateModal';
import DeleteModal from './DeleteModal';
import SendReminder from './SendReminder';


const ActionButtons = ({ member, getSingleMember }) => {
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);


    return (
        <div className='flex flex-col items-center'>
            <h1 className='text-center text-xl mb-2 px-4 py-1 rounded bg-slate-200 text-slate-900'>Action Buttons</h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-around  text-xs py-4">
                <SendReminder member={member}/>
                <button
                    className="px-3 py-1.5 rounded flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 bg-black/60"
                    onClick={() => setUpdateModal(true)}
                >
                    <ShieldCheck className='w-5 text-green-600' /> Update & Verify
                </button>
                <button
                    className="px-3 py-1.5 rounded  cursor-pointer flex items-center justify-center gap-2 hover:opacity-80 bg-black/60"
                    onClick={() => setDeleteModal(true)}
                >
                    <Trash2 className='w-5 text-red-600' /> Terminate
                </button>
            </div>

            {
                updateModal
                &&
                <VerifyUpdateModal
                    onClose={() => setUpdateModal(false)}
                    member={member}
                    getSingleMember={getSingleMember}
                />
            }


            {
                deleteModal
                &&
                <DeleteModal 
                onClose={() => setDeleteModal(false)}
                member={member}
                />
            }
        </div>

    )
}

export default ActionButtons