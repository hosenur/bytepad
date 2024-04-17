import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import "./App.css"
import AuthenticatedLayout from './layouts/AuthenticatedLayout'
import RootLayout from './layouts/RootLayout'
import { Landing } from './pages/Landing'
import Playgrounds from './pages/Playgrounds'
import Login from './pages/Login'
import Register from './pages/Register'
import Playground from './pages/Playground'
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/login/*", element: <Login /> },
      { path: "/register/*", element: <Register /> },
      {
        element: <AuthenticatedLayout />,
        path: "/",
        children: [
          { path: "/playgrounds", element: <Playgrounds /> },
          { path: "/playground/:id", element: <Playground /> },
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
