import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';




const PlanForm = ({ defaultValues, onClose, onSubmit, isEditing }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({ defaultValues });
    

    const submitHandler = async (data) => {
        try {
            await onSubmit(data);
            toast.success(`Plan ${isEditing ? 'updated' : 'added'} successfully`);
            onClose();
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    };


    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md">
                <h2 className="text-lg font-semibold text-slate-200 mb-4">
                    {isEditing ? 'Edit Plan' : 'Add New Plan'}
                </h2>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 text-white text-sm">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <select                             {...register('title', { required: 'Title is required' })} className="w-full px-3 py-2 rounded bg-slate-800 outline-none">
                            <option value="">Choose</option>
                            <option value="yearly">Yearly</option>
                            <option value="half-yearly">Half-yearly</option>
                            <option value="quaterly">Quaterly</option>
                            <option value="monthly">Monthly</option>
                            <option value="day-pass">Day-pass</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('price', {
                                required: 'Price is required',
                                min: {
                                    value: 1,
                                    message: 'Minimum price must be ₹1',
                                },
                            })}
                            placeholder="Price"
                            type="number"
                            className="w-full px-3 py-2 rounded bg-slate-800 outline-none"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Duration (in days) <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('duration', { required: 'Duration is required' })}
                            placeholder="Duration"
                            className="w-full px-3 py-2 rounded bg-slate-800 outline-none"
                        />
                        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
                    </div>

                    {/* Features */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Features (comma-separated)</label>
                        <textarea
                            {...register('features')}
                            placeholder="e.g. Access to all equipment, Free diet plan"
                            className="w-full px-3 py-2 rounded bg-slate-800 outline-none"
                        />
                    </div>

                    {/* Discount */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Discount (in %)</label>
                        <input
                            {...register('discount')}
                            placeholder="Discount"
                            className="w-full px-3 py-2 rounded bg-slate-800 outline-none"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer text-gray-300 bg-slate-600 px-4 py-2 rounded hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className={`cursor-pointer bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 ${isSubmitting && "opacity-70"}`}
                        >
                            {isEditing ? (isSubmitting ? "Updating..." : "Update") : (isSubmitting ? "Submitting..." : "Add")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlanForm;
