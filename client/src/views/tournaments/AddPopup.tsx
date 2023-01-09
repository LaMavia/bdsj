import {
  Alert,
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from '@mui/material'
import SelectInput from '@mui/material/Select/SelectInput'
import { MouseEventHandler, useState } from 'react'
import { CountryInfo, PutApiResponse, TournamentInfo } from '../../api'
import { API_URL } from '../../config'

export interface AddPopupParams {
  show: boolean
  handleClose: () => void
  onSuccess: () => void
  onError: () => void
}

export const AddPopup = ({
  show,
  handleClose,
  onSuccess,
  onError,
}: AddPopupParams) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [countryCode, setCountryCode] = useState('')
  const [location, setLocation] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')
  const [countries, setCountries] = useState<CountryInfo[]>([])
  const [locations, setLocations] = useState([])

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    const uri = `${API_URL}?path=auth`
    fetch(uri, {
      body: name,
      method: 'POST',
      credentials: 'include',
    })
      .then(res => res.json())
      .then((res: PutApiResponse) => {
        if (res.ok) {
          setAlertSeverity('success')
          setAlertMsg('poprawnie dodano turniej')
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
        <DialogTitle>Dodawanie turnieju</DialogTitle>
        <DialogContent>
          <FormGroup>
            <TextField
              disabled={isLoading}
              autoFocus
              margin="dense"
              id="name"
              label="Nazwa"
              type="text"
              fullWidth
              variant="standard"
              name="name"
              onChange={e => {
                setName(e.target.value)
              }}
            />
            <TextField
              disabled={isLoading}
              autoFocus
              margin="dense"
              id="password"
              label="Rok"
              type="number"
              fullWidth
              variant="standard"
              name="year"
              onChange={e => {
                setYear(+e.target.value)
              }}
            />
            <FormGroup sx={{ flexFlow: 'row' }}>
              <Select name="country" label="kraj" id="country" sx={{ flexGrow: 4 }}>
                {countries.map(c => (
                  <MenuItem value={c.country_code}>{c.country_name}</MenuItem>
                ))}
              </Select>
              <Button sx={{ flexGrow: 1 }}>
                Dodaj Kraj
              </Button>
            </FormGroup>
          </FormGroup>
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
      </Dialog>
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={closeAlert}>
        <Alert
          onClose={closeAlert}
          severity={alertSeverity}
          sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  )
}
