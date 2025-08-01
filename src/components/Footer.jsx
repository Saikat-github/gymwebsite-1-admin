import { Instagram, Twitter, Facebook, Dumbbell } from 'lucide-react'



const Footer = () => {
  return (
    <footer id='footer' className="bg-gray-950 text-white py-20 mt-32">
      <div className="max-w-7xl flex flex-col justify-center gap-4  px-4 sm:px-6 lg:px-8 border-t border-gray-700 mt-8 pt-8 text-center text-xs">
        <a
        className='text-blue-700' href="https://gymwebsite-1-frontend.vercel.app/" target="_blank" rel="noopener noreferrer">Go to User Panel</a>
        <p>&copy; {new Date().getFullYear()} Minimalist Gyms. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;




