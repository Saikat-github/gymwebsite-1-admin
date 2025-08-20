import React, { useEffect, useState } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { getDocuments } from '../../services/firebase/db';
import { getStartEndDate } from '../../services/utils/utilFunctions';
import { toast } from 'react-toastify';
import { SingleDayPass } from '../../components';

const filterOptions = [
    'Today',
    'ThisWeek',
    'LastWeek',
    'ThisMonth',
    'LastMonth',
    'LastSixMonths',
    'ThisYear',
    'LastYear',
];

const DayPasses = () => {
    const [selectedFilter, setSelectedFilter] = useState('Today');
    const [dayPasses, setDayPasses] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [loader, setLoader] = useState(true);



    const fetchDayPassesFromDB = async (lastDocument = null) => {
        try {
            setLoader(true);
            const { startDate, endDate } = getStartEndDate(selectedFilter.toLowerCase());
            const result = await getDocuments("dayPasses", null, lastDocument, 10,
                [
                    { field: 'createdAt', operator: '>=', value: startDate },
                    { field: 'createdAt', operator: '<=', value: endDate },
                    { field: 'payment', operator: '==', value: 'completed'}
                ]
            )
            if (result.success) {
                return result;
            } else {
                toast.error("Failed to fetch payments");
            }
        } catch (error) {
            toast.error(error.message); f
            return null;
        } finally {
            setLoader(false);
        }
    }



    const loadDayPasses = async () => {
        const result = await fetchDayPassesFromDB();
        console.log(result);
        if (result) {
            setDayPasses(result.data);
            setLastDoc(result.lastDoc);
            setHasMore(result.hasMore);
        }
    };


useEffect(() => {
    loadDayPasses();
}, [selectedFilter]);


    const loadMore = async () => {
        if (!hasMore || loader) return;
        const result = await fetchDayPassesFromDB(lastDoc);
        if (result) {
            setDayPasses(prev => [...prev, ...result.data]);
            setLastDoc(result.lastDoc);
            setHasMore(result.hasMore);
        }
    }


    return (
        <div className="py-10 px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-semibold text-center">Day Passes</h1>
                <div className="flex gap-2 sm:gap-0 flex-col sm:flex-row justify-center items-center">
                    {/* Filter Dropdown */}
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="bg-slate-800 text-white px-4 py-2 rounded focus:outline-none"
                    >
                        {filterOptions.map((option) => (
                            <option key={option} value={option} className="bg-slate-900">
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Payment List */}
                <div className="flex flex-col gap-6 items-center">
                    {dayPasses?.length > 0
                        ?
                        (
                            dayPasses.map((dayPass) => (
                                <SingleDayPass
                                    loadDayPasses={loadDayPasses}
                                    key={dayPass.id}
                                    pass={dayPass}
                                />
                            ))
                        )
                        :
                        (
                            <p className="text-center text-gray-400">No day pass found for {selectedFilter}.</p>
                        )}

                    {
                        loader && <Loader2 className='w-8 animate-spin my-4 mx-auto' />
                    }
                    <button className={`border border-orange-600 cursor-pointer text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto my-4 ${!hasMore && "hidden"}`} onClick={loadMore} disabled={loader}>
                        Load More...
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DayPasses