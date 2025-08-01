import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarClock, Loader2, Pencil, Save } from 'lucide-react';
import { addDocument, getDocuments, updateDocument } from '../../services/firebase/db';
import { toast } from 'react-toastify';

const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];


const ScheduleForm = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [savedSchedule, setSavedSchedule] = useState({});
    const [loader, setLoader] = useState(false);

    const { register, handleSubmit, reset } = useForm({});

    useEffect(() => {
        const loadFirstSchedule = async () => {
            try {
                setLoader(true)
                const result = await getDocuments("gymSchedule");
                if (result.data[0]) {
                    const { createdAt, id, ...rest } = result.data[0]
                    setSavedSchedule(rest)
                } else {
                    setSavedSchedule({})
                }
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoader(false);
            }
        }

        loadFirstSchedule();
    }, [])


    const onSubmit = async (data) => {
        try {
            setSavedSchedule(data);
            setIsEditing(false);

            const result1 = await getDocuments("gymSchedule");
            if (result1.data[0]) {
                const result2 = await updateDocument("gymSchedule", result1.data[0].id, data)
                if (!result2.success) {
                    toast.error(result2.message)
                }
            } else {
                const result2 = await addDocument("gymSchedule", data);
                if (!result2.success) {
                    toast.error(result2.message)
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }


    const toggleEdit = () => {
        if (isEditing) {
            handleSubmit(onSubmit)(); // Save on clicking again
        } else {
            reset(savedSchedule); // Load current values into form
            setIsEditing(true);
        }
    };



    if (loader) {
        return <div className="bg-slate-900 rounded-xl p-6 shadow-lg max-sm:text-sm">
            <Loader2 className='animate-spin w-6 mx-auto' />
        </div>
    }



    return (
        <div className="bg-slate-900 rounded-xl sm:p-6 p-4 shadow-lg max-sm:text-sm">
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-4">
                <h2 className="text-lg sm:text-2xl font-semibold flex sm:items-center gap-2">
                    <CalendarClock className="text-orange-600 " />
                    Gym Schedule (24h)
                </h2>
                <button
                    className="cursor-pointer flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-orange-700 transition"
                    onClick={toggleEdit}
                >
                    {isEditing ? <Save size={16} /> : <Pencil size={16} />}
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-300">

                {daysOfWeek.map((day) => (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <label className="sm:w-28 font-semibold">{day}:</label>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="time"
                                    {...register(`${day}.open`)}
                                    className="bg-slate-800 px-2 py-1 rounded text-white"
                                />
                                <span className="text-white">to</span>
                                <input
                                    type="time"
                                    {...register(`${day}.close`)}
                                    className="bg-slate-800 px-2 py-1 rounded text-white"
                                />
                            </div>
                        ) : (
                            Object.keys(savedSchedule).length > 0 && savedSchedule[day]
                                ? <p>{savedSchedule[day].open} to {savedSchedule[day].close}</p>
                                : <p>00:00 to 00:00</p>
                        )}
                    </div>
                ))}
            </form>
        </div>
    );
};

export default ScheduleForm;
