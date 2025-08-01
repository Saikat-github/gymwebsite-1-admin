import { NavLink, useNavigate } from "react-router-dom"
import { signOut } from "../../services/firebase/auth";
import { toast } from "react-toastify";
import { useState } from "react";
import { Loader2, LogIn, Power } from "lucide-react";



const Logout = ({ isAdmin, setIsOpen }) => {
    const [loader, setLoader] = useState(false);


    const navigate = useNavigate()
    const handleLogOut = async () => {
        try {
            setLoader(true);
            const result = await signOut();
            if (result.success) {
                setIsOpen(false);
                navigate('/admin/login');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        } finally {
            setLoader(false)
        }
    };


    return (
        <>

            {
                isAdmin
                    ?

                    <button
                        onClick={handleLogOut}
                        className="cursor-pointer flex gap-2 items-center hover:text-orange-600 text-sm"
                    >
                        <Power className="w-5 text-orange-600" />
                        {loader ? <Loader2 className='w-4 animate-spin' /> : "Logout"}
                    </button>
                    :
                    <NavLink
                        className="cursor-pointer flex gap-2 items-center hover:text-orange-600 text-sm"
                        to="/admin/login"
                        onClick={() => setIsOpen(false)}
                    >
                        <LogIn className="w-5 text-orange-600" />
                        Login
                    </NavLink>
            }
        </>
    )
}

export default Logout