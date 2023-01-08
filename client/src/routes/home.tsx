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
import { AuthApiResponse } from '../api'
import { API_URL } from '../config'

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
    const uri = `${API_URL}/?path=auth`
    fetch(uri, {
      body: pass,
      method: 'POST',
      credentials: 'include'
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
      {redirect && <Navigate to={redirectTo} />}
    </>
  )
}

function RawItem(props: ComponentProps<typeof Paper>) {
  const StyledButton = styled(Button)(({ theme }) => ({
    height: '100%',
    width: '100%',
    padding: '0 20px',
  }))
  return (
    <Paper {...props}>
      <StyledButton>{props.children}</StyledButton>
    </Paper>
  )
}

export const HomeRoute = () => {
  const Item = styled(RawItem)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background: theme.palette.background.default,
    height: 100,
    lineHeight: '100px',
  }))
  const [showPass, setShowPass] = useState(false)

  return (
    <>
      <Box
        sx={{
          p: 2,
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr' },
          gap: 2,
        }}>
        <Item
          elevation={2}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            setShowPass(true)
          }}>
          Organizatorzy
        </Item>
        <Item elevation={2}>Widzowie</Item>
      </Box>
      <AuthPopup
        show={showPass}
        redirectTo={'/tournaments'}
        handleClose={() => {
          setShowPass(false)
        }}
      />
    </>
  )
}
