import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import { getISTTime } from '../../../services/utils/utilFunctions';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../services/firebase/config';
import { toast } from 'react-toastify';





const SendReminderButton = ({ member }) => {
    const [loader, setLoader] = useState(false);

    const sendReminderEmail = httpsCallable(functions, 'sendReminderEmail');

    const handleSendEmail = async () => {
        try {
            setLoader(true)
            const messageHtml = `
      <p>Hi ${member.name},</p>
      <p>We hope you're doing great!</p>
      <p>Your membership is expiring on <strong>${getISTTime(member.endDate)}</strong>.</p>
      <p>Please renew your membership to continue enjoying our facilities.</p>
      <p>Best regards,<br>Your Gym Team</p>
    `;

            const result = await sendReminderEmail({
                to: member.userEmail,
                subject: 'Friendly Reminder: Renew Your Gym Membership',
                messageHtml,
            })
            if (result.data.success) {
                toast.success(result.data.message);
            } else {
                toast.error(result.data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error("Some error occurred, failed to send email")
        } finally {
            setLoader(false);
        }
    };

    return (
        <button
            disabled={loader}
            className="px-3 py-1.5 rounded flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 bg-black/60"
            onClick={handleSendEmail}
        >
            <Mail className='w-5 text-slate-300' />
            {loader ? 'Sending...' : 'Send Reminder Email'}
        </button>
    )
};

export default SendReminderButton;
