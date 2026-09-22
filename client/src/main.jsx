import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Login.jsx'
import AmbassadorDashboard from './AmbassadorDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx'
import AdminLayout from './AdminLayout.jsx'
import Ambassadors from './Ambassadors.jsx'
import CreateTask from './CreateTask.jsx'
import AmbassadorLayout from './AmbassadorLayout.jsx'
import AmbassadorTasks from './AmbassadorTasks.jsx'
import ContactUs from './ContactUs.jsx'
import Profile from './Profile.jsx'
import AmbassadorInbox from './AmbassadorInbox.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import AdminTasks from './AdminTasks.jsx'
import AdminInbox from './AdminInbox.jsx'
import CreateAmbassador from './CreateAmbassador.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        index: true,
        element: <Login/>
      },
      {
        path: "/ambassador",
        element: <ProtectedRoute>
          <AmbassadorLayout/>
        </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <ProtectedRoute>
              <AmbassadorDashboard/>
            </ProtectedRoute>
          },
          {
            path: "tasks",
            element: <ProtectedRoute>
              <AmbassadorTasks/>
            </ProtectedRoute>
          },
          {
            path: "inbox",
            element: <ProtectedRoute>
              <AmbassadorInbox/>
            </ProtectedRoute>
          },
          {
            path: "profile",
            element: <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }
        ]
      },
      {
        path: "/adminDashboard",
        element: <AdminLayout/>,
        children: [
          {
            index: true,
            element: <ProtectedRoute>
              <Ambassadors/>
            </ProtectedRoute>
          },
          {
            path: "tasks",
            element: <ProtectedRoute>
              <AdminTasks/>
            </ProtectedRoute>
          },
          {
            path: "createTask",
            element: <ProtectedRoute>
              <CreateTask/>
            </ProtectedRoute>
          },
          {
            path: "inbox",
            element: <ProtectedRoute>
              <AdminInbox/>
            </ProtectedRoute>
          },
          {
            path: "createAmbassador",
            element: <ProtectedRoute>
              <CreateAmbassador/>
            </ProtectedRoute>
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
