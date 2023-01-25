import {
  Alert,
  AlertColor,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  styled,
  TextField,
} from '@mui/material'
import { ComponentProps, MouseEventHandler, useState } from 'react'
import { Navigate } from 'react-router'
import { ApiResponse, AuthApiResponse } from '../api'
import { Tile } from '../components/Tile'
import { API_URL } from '../config'
import { isAuth } from '../state/global'

interface AuthPopupParams {
  show: boolean
  redirectTo: string
  handleClose: () => void
}
const AuthPopup = ({ show, handleClose, redirectTo }: AuthPopupParams) => {
  const [pass, setPass] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    const uri = `${API_URL}?path=auth`
    fetch(uri, {
      body: pass,
      method: 'POST',
      credentials: 'include',
    })
      .then(res => res.json())
      .then((res: AuthApiResponse) => {
        if (res.ok) {
          setAlertSeverity('success')
          setAlertMsg('poprawne hasło, przekierowuję')
          setRedirect(true)
          handleClose()
        } else {
          setAlertSeverity('error')
          setAlertMsg(res.error || '')
        }
      })
      .catch((e: TypeError) => {
        debugger
        console.log(uri)
        setAlertMsg(e.message)
        setAlertSeverity('error')
      })
      .finally(() => {
        setShowAlert(true)
        setIsLoading(false)
      })
  }

  const closeAlert = () => {
    setShowAlert(false)
  }

  return (
    <>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Wpisz hasło organizatora</DialogTitle>
        <DialogContent>
          <TextField
            disabled={isLoading}
            autoFocus
            margin="dense"
            id="password"
            label="Hasło"
            type="password"
            fullWidth
            variant="standard"
            name="password"
            onChange={e => {
              setPass(e.target.value)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={handleClose}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isLoading} onClick={onSubmit}>
            Potwierdź
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={closeAlert}>
        <Alert
          onClose={closeAlert}
          severity={alertSeverity}
          sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
      {((show && isAuth()) || redirect) && <Navigate to={redirectTo} />}
    </>
  )
}

export const HomeRoute = () => {
  const [showPass, setShowPass] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')
  const [redirect, setRedirect] = useState(false)
  const closeAlert = () => {
    setShowAlert(false)
  }

  const onViewerClick = () => {
    fetch(`${API_URL}?path=end_session`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 200) {
          setRedirect(true)
        } else {
          res.json().then((r: ApiResponse<null, string>) => {
            setAlertSeverity('warning')
            setAlertMsg(r.error)
          })
        }
      })
      .catch((e: TypeError) => {
        setAlertSeverity('error')
        setAlertMsg(e.message)
      })
  }

  return (
    <>
      <Box
        sx={{
          p: 2,
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr' },
          gap: 2,
        }}>
        <Tile
          elevation={2}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            setShowPass(true)
          }}>
          Organizatorzy
        </Tile>
        <Tile
          elevation={2}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            onViewerClick()
          }}>
          Widzowie
        </Tile>
      </Box>
      <AuthPopup
        show={showPass}
        redirectTo={'./choice_panel'}
        handleClose={() => {
          setShowPass(false)
        }}
      />
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={closeAlert}>
        <Alert
          onClose={closeAlert}
          severity={alertSeverity}
          sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
      {redirect && <Navigate to={'./choice_panel'} />}
    </>
  )
}
