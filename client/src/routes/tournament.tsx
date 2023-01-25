import { Alert, AlertColor, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { ApiResponse, TournamentInfo } from '../api'
import { Loader } from '../components/Loader'
import { API_URL } from '../config'
import { isAuth } from '../state/global'

export const TournamentRoute = () => {
  const match = useMatch('/tournament/:id')
  if (!match) {
    throw new Error("shouldn't happen")
  }

  const id = +(match.params.id || '0')
  const auth = isAuth()
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')
  const [tournament, setTournament] = useState<TournamentInfo>()
  const [refetch, setRefetch] = useState(false)

  // onMount
  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}?path=tournament/get`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        ids: [id],
      }),
    })
      .then(r => {
        if (r.status !== 200) {
          throw new TypeError(r.statusText)
        }

        return r.json() as Promise<ApiResponse<TournamentInfo[], string>>
      })
      .then(r => {
        if (!r.ok) {
          throw new TypeError(r.error)
        }

        if (!r.data.length) {
          throw new TypeError(`Invalid id=${id}`)
        }

        setTournament(r.data[0])
      })
      .catch((e: TypeError) => {
        setAlertMsg(e.message)
        setShowAlert(true)
        setAlertSeverity('error')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [refetch])

  return (
    <>
      <Loader loading={loading} />
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}>
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertSeverity}
          sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  )
}
