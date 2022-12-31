import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createHashRouter,
  RouterProvider
} from 'react-router-dom'
import NotFoundPage from "./routes/notFound"

const router = createHashRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
    errorElement: <NotFoundPage/>
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
