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
  country_code: string,
  handleClose: () => void
  onSuccess: () => void
  onError: () => void
}

export const AddLocationPopup = ({
  show,
  country_code,
  handleClose,
  onSuccess,
  onError,
}: SmallAddParams) => {
  const [city, setCity] = useState('')
  const [name, setName] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    const uri = `${API_URL}?path=location/post`
    fetch(uri, {
      body: JSON.stringify(
        {
          name,
          city,
          country_code
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
          setAlertMsg('poprawnie dodano lokalizację')

          // reset the form
          setCity('')
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
        debugger
        console.log(uri)
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
              id="city"
              label="miasto"
              type="text"
              fullWidth
              variant="standard"
              name="city"
              value={city}
              onChange={e => {
                setCity(e.target.value)
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
