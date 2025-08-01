// src/components/VerifySignIn.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkForSignInLink, completeSignInWithEmailLink   } from '../../services/firebase/auth';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';



const VerifySignIn = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const { isSignInLink, email: storedEmail } = checkForSignInLink();
    
    if (isSignInLink) {
      if (storedEmail) {
        // Auto-complete sign-in if email is available
        completeSignIn(storedEmail);
      } else {
        // Email not found in storage, need manual input
        setLoading(false);
      }
    } else {
      // Not a sign-in link, redirect to sign-in
      navigate('/admin/login');
    }
  }, [navigate]);



  const completeSignIn = async (emailToUse) => {
    setLoading(true);
    
    try {
      const result = await completeSignInWithEmailLink(
        emailToUse, 
        window.location.href
      );
      
      if (result.success) {
        // Redirect to homepage after successful sign-in
        toast.success("Login successful")
        navigate('/');
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    completeSignIn(email);
  };


  if (!loading) {
    return (
      <div className="flex justify-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8 text-center flex flex-col items-center">
          <Loader2 className='w-10 h-10 animate-spin'/>
          <p className="text-xl font-medium">Signing you in...</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="flex justify-center my-20">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg border border-slate-400 text-slate-200">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Complete Sign In</h1>
          <p className="mt-2 text-sm">Enter the email you used to request the sign-in link</p>
        </div>
        
        {error && (
          <div className="p-4 rounded-md">
            <p className="text-sm text-red-700">{error}, <br />
            Request a <span className='text-blue-600 cursor-pointer' onClick={() => navigate("/login")}>new link</span></p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          
          <div>
            <button
              type="submit"
              className="cursor-pointer flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Complete Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifySignIn;