
import { useForm } from 'react-hook-form';
import { Mail, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendSignInLink, signInWithGoogle } from '../../services/firebase/auth';
import { toast } from 'react-toastify'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';



const Login = () => {
  const [loading, setLoading] = useState(false);

  const location = useLocation()
  const navigate = useNavigate();

  // Extract the redirect path if it exists
  const from = location.state?.from?.pathname || '/'; // default to home if no previous route
  const { user } = useContext(AuthContext);

  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const actionCodeSettings = {
        // URL you want to redirect to after sign-in
        url: `${window.location.origin}/admin/verify-signin`,
        // This must be true for email link sign-in
        handleCodeInApp: true,
      };

      const result = await sendSignInLink(data.email, actionCodeSettings);

      setLoading(false);
      if (result.success) {
        toast.success(`Please click the link sent to ${data.email}. Check your inbox!`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      if (result.success) {
        toast.success('Successfully signed in with Google!');
        navigate(from, { replace: true });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }


  
  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="border border-gray-400 p-4 sm:p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 max-sm:text-xs">
        <h2 className="text-xl sm:text-3xl font-semibold text-white text-center">Login</h2>

        {/* Google Login */}
        <button
          disabled={loading}
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full bg-white text-zinc-900 font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="text-center text-zinc-500 text-sm">or</div>

        {/* Email Login */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2">
              <Mail className="text-zinc-400 w-5 h-5 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent outline-none w-full text-white"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2 rounded-lg transition cursor-pointer flex gap-2 justify-center"
          >
            {loading ? <Loader2 className='w-4 animate-spin' /> : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
