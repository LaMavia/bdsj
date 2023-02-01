import {
  Alert,
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from '@mui/material'
import SelectInput from '@mui/material/Select/SelectInput'
import { MouseEventHandler, useEffect, useState } from 'react'
import {
  ApiResponse,
  CountryInfo,
  LocationInfo,
  PutApiResponse,
  TournamentInfo,
} from '../../api'
import { API_URL } from '../../config'

export interface SmallAddParams {
  show: boolean
  handleClose: () => void
  onSuccess: () => void
  onError: () => void
}

export const AddCountryPopup = ({
  show,
  handleClose,
  onSuccess,
  onError,
}: SmallAddParams) => {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    const uri = `${API_URL}?path=country/post`
    fetch(uri, {
      body: JSON.stringify(
        {
          name,
          code,
        },
        null,
        0,
      ),
      method: 'POST',
      credentials: 'include',
    })
      .then(res => res.json())
      .then((res: PutApiResponse) => {
        if (res.ok) {
          setAlertSeverity('success')
          setAlertMsg('poprawnie dodano kraj')

          // reset the form
          setCode('')
          setName('')

          handleClose()
          onSuccess()
        } else {
          setAlertSeverity('error')
          setAlertMsg(res.error || '')
          onError()
        }
      })
      .catch((e: TypeError) => {
        setAlertMsg(e.message)
        setAlertSeverity('error')
        onError()
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
        <DialogTitle>Dodawanie kraju</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              disabled={isLoading}
              autoFocus
              margin="dense"
              id="name"
              label="nazwa"
              type="text"
              fullWidth
              variant="standard"
              name="name"
              value={name}
              onChange={e => {
                setName(e.target.value)
              }}
            />
            <TextField
              disabled={isLoading}
              autoFocus
              margin="dense"
              id="code"
              label="kod"
              type="text"
              fullWidth
              variant="standard"
              name="code"
              value={code}
              onChange={e => {
                setCode(e.target.value)
              }}
            />
          </FormControl>
          <div></div>
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={handleClose}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isLoading} onClick={onSubmit}>
            Potwierdź
          </Button>
        </DialogActions>
        <Snackbar open={showAlert} autoHideDuration={6000} onClose={closeAlert}>
          <Alert
            onClose={closeAlert}
            severity={alertSeverity}
            sx={{ width: '100%' }}>
            {alertMsg}
          </Alert>
        </Snackbar>
      </Dialog>
    </>
  )
}
