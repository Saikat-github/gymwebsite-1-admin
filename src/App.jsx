import { useContext, useState } from 'react'
import { Footer, ScrollToTop, Sidebar } from './components'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Loader2 } from 'lucide-react'
import { AuthContext } from './context/AuthContext'


function App() {
  const { loading } = useContext(AuthContext);

  return (
    !loading
      ?
      <div className='font-family-lexend bg-slate-950
 text-white'>
        <Sidebar />
        <ToastContainer />
        <main className='md:ml-64 max-sm:pt-10'>
          <div className='min-h-screen'>
            <ScrollToTop />
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
      :
      <div className="bg-gradient-to-r from-slate-950 via-gray-950 to-slate-800
 text-white flex justify-center py-28 min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8 text-center flex flex-col items-center">
          <Loader2 className='w-10 h-10 animate-spin' />
          <p className="text-xl font-medium">Loading...</p>
        </div>
      </div>

  )
}

export default App
