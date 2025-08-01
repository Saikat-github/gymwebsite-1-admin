import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { deleteUserProfileComplete } from "../../../services/firebase/db";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



const DeleteModal = ({ memberId, userId, onClose }) => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const onConfirm = async () => {
    try {
      setLoader(true);
      const result = await deleteUserProfileComplete(memberId, userId);
      if (result.success) {
        toast.success(result.message);
        navigate("/members")
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70
bg-opacity-50 z-50 mx-2">
      {
        loader
          ?
          <Loader2 className="animate-spin text-red-600 mx-auto w-10 h-10" />
          :
          <div className="bg-slate-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <div className="text-slate-300 text-lgs">
              <h1>If you delete this profile, following things will happen</h1>
              <div>
                <div className="text-xs my-4 space-y-2">
                  <li>All profile data (if any) will be permanently erased</li>
                  <li>Any ongoing membership plan (if any) will be removed</li>
                  <li>All of the payments and daypass details (if any) will be removed</li>
                  <li>You/the member won't be able to recover any of the above data in the future</li>
                </div>
              </div>
              <p className="text-center">Are you sure?</p>
            </div>
            <div className="mt-6 flex justify-around space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 cursor-pointer bg-gray-300 text-slate-800 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
      }

    </div>
  );
};

export default DeleteModal;
