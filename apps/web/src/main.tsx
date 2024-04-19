import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import "./App.css"
import AuthenticatedLayout from './layouts/AuthenticatedLayout'
import RootLayout from './layouts/RootLayout'
import { Landing } from './pages/Landing'
import Login from './pages/Login'
import Playground from './pages/Playground'
import Playgrounds from './pages/Playgrounds'
import Register from './pages/Register'
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
          { path: "/playground/:tag", element: <Playground /> },
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <main className='font-manrope'>

      <RouterProvider router={router} />
      <Toaster />
    </main>
  // </React.StrictMode>,
)
