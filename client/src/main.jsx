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
        element: <AmbassadorLayout/>,
        children: [
          {
            index: true,
            element: <AmbassadorDashboard/>
          },
          {
            path: "tasks",
            element: <AmbassadorTasks/>
          },
          {
            path: "inbox",
            element: <AmbassadorInbox/>
          },
          {
            path: "profile",
            element: <Profile/>
          }
        ]
      },
      {
        path: "/adminDashboard",
        element: <AdminLayout/>,
        children: [
          {
            index: true,
            element: <Ambassadors/>
          },
          {
            path: "createTask",
            element: <CreateTask/>
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
