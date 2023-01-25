import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import NotFoundPage from './routes/notFound'
import { CenteredLayout } from './layouts/centered'
import { getGlobalProvider } from './state/global'
import { HomeRoute } from './routes/home'
import { createTheme, ThemeProvider } from '@mui/material'
import { TournamentsRoute } from './routes/tournaments'
import './vite-env.d.ts'
import { ChoicePanelRoute } from './routes/choice_panel'
import { TournamentRoute } from './routes/tournament'

const router = createHashRouter([
  {
    path: '/',
    element: <CenteredLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <HomeRoute />,
      },
      {
        path: '/choice_panel',
        element: <ChoicePanelRoute />,
      },
      {
        path: '/tournaments',
        element: <TournamentsRoute />,
      },
      {
        path: '/tournament/:id',
        element: <TournamentRoute />,
      },
    ],
  },
])

const App = () => {
  const GlobalProvider = getGlobalProvider()
  const theme = createTheme({ palette: { mode: 'dark' } })

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <GlobalProvider>
          <RouterProvider router={router} />
        </GlobalProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />,
)
