import React, { useState } from 'react'
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
import { RoundRoute } from './routes/round'
import { PersonsRoute } from './routes/persons'
import { PersonRoute } from './routes/person'
import { CountriesRoute } from './routes/countries'
import { CountryRoute } from './routes/country'
import { LocationsRoute } from './routes/locations'
import { LocationRoute } from './routes/location'

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
      {
        path: '/round/:id',
        element: <RoundRoute />,
      },
      {
        path: '/persons',
        element: <PersonsRoute />,
      },
      {
        path: '/person/:id',
        element: <PersonRoute />,
      },
      {
        path: '/countries',
        element: <CountriesRoute />,
      },
      {
        path: '/country/:id',
        element: <CountryRoute />,
      },
      {
        path: '/locations',
        element: <LocationsRoute />,
      },
      {
        path: '/location/:id',
        element: <LocationRoute />,
      },
    ],
  },
])

const App = () => {
  const GlobalProvider = getGlobalProvider()
  const [useDark, setUseDark] = useState(true)
  const theme = createTheme({ palette: { mode: useDark ? 'dark' : 'light' } })

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
