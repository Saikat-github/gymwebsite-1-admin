import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AllMembers, Home, RegisteredUsers, SingleMember, PaymentsPage, GymInfo, Login, VerifySignIn, NotFound, AdminManagement, DayPasses, SinglePass } from './pages'
import AuthContextProvider from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoutes.jsx'




const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute>
          <Home />
        </ProtectedRoute>

      },
      {
        path: "/admin/login",
        element: <Login />
      },
      {
        path: "/admin/verify-signin",
        element: <VerifySignIn />
      },
      {
        path: "/admin/users",
        element: <ProtectedRoute>
          <RegisteredUsers />
        </ProtectedRoute>
      },
      {
        path: "/admin/members",
        element: <ProtectedRoute>
          <AllMembers />
        </ProtectedRoute>
      },
      {
        path: "/admin/members/:userId",
        element: <ProtectedRoute>
          <SingleMember />
        </ProtectedRoute>
      },
      {
        path: "/admin/payments",
        element: <ProtectedRoute>
          <PaymentsPage />
        </ProtectedRoute>
      },
      {
        path: "/admin/day-passes",
        element: <ProtectedRoute>
          <DayPasses />
        </ProtectedRoute>
      },
            {
        path: "/admin/day-passes/:id",
        element: <ProtectedRoute>
          <SinglePass />
        </ProtectedRoute>
      },
      {
        path: "/admin/gyminfo",
        element: <ProtectedRoute>
          <GymInfo />
        </ProtectedRoute>
      },
      {
        path: "/admin/manage-admins",
        element: <ProtectedRoute>
          <AdminManagement />
        </ProtectedRoute>
      },



      {
        path: "*",
        element: <NotFound />
      },
    ]
  }
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider >
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>,
)
