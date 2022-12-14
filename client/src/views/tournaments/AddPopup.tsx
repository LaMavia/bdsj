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
import { AddCountryPopup } from './AddCountryPopup'

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
  const [refetch, setRefetch] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')
  const [countries, setCountries] = useState<CountryInfo[]>([])
  const [locations, setLocations] = useState<LocationInfo[]>([])

  const [showCountry, setShowCountry] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    Promise.all(
      ['location/get', 'country/get'].map(path =>
        fetch(`${API_URL}?path=${path}`, {
          method: 'GET',
          credentials: 'include',
        }),
      ),
    )
      .then(rs => {
        if (rs[0].status !== 200) {
          throw new TypeError(
            rs.map(r => `${r.url} => ${r.statusText}`).join(', '),
          )
        }

        return Promise.all(rs.map(r => r.json())) as Promise<[any, any]>
      })
      .then(
        ([loc_r, cou_r]: [
          ApiResponse<LocationInfo[], string>,
          ApiResponse<CountryInfo[], string>,
        ]) => {
          let err = ''

          if (loc_r.ok) {
            setLocations(loc_r.data)
          } else {
            err += `location/get => ${loc_r.error}`
          }

          if (cou_r.ok) {
            setCountries(cou_r.data)
          } else {
            err += `country/get => ${cou_r.error}`
          }

          if (err) {
            setAlertMsg(err)
            setAlertSeverity('error')
            setShowAlert(true)
          }
        },
      )
      .catch((e: Error) => {
        setAlertMsg(e.message)
        setAlertSeverity('error')
        setShowAlert(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [refetch])

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    const uri = `${API_URL}?path=tournament/put`
    fetch(uri, {
      body: name,
      method: 'PUT',
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
          <FormControl fullWidth sx={{ minWidth: '500px' }}>
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
              value={name}
              onChange={e => {
                setName(e.target.value)
              }}
            />
            <TextField
              disabled={isLoading}
              autoFocus
              margin="dense"
              id="year"
              label="Rok"
              type="number"
              fullWidth
              variant="standard"
              name="year"
              value={year}
              onChange={e => {
                setYear(+e.target.value)
              }}
            />
            <FormControl fullWidth sx={{ flexFlow: 'row', marginTop: '1rem' }}>
              <InputLabel id="country-label">Kraj</InputLabel>
              <Select
                labelId="country-label"
                name="country"
                id="country"
                sx={{ flexBasis: 4, flexGrow: 4 }}
                value={countryCode}
                onChange={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCountryCode((e.target.value as string | undefined) || '')
                }}>
                {countries.map(c => (
                  <MenuItem value={c.country_code}>{c.country_name}</MenuItem>
                ))}
                <MenuItem value={1}>hello</MenuItem>
              </Select>
              <Button
                variant="contained"
                sx={{ marginLeft: '0.5rem', flexBasis: 1, flexGrow: 1 }}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()

                  setShowCountry(true)
                }}>
                Dodaj Kraj
              </Button>
            </FormControl>
            <FormControl fullWidth sx={{ flexFlow: 'row', marginTop: '1rem' }}>
              <InputLabel id="location-label">Lokalizacja</InputLabel>
              <Select
                labelId="location-label"
                name="location"
                id="location"
                sx={{ flexBasis: 4, flexGrow: 4 }}
                value={location}
                onChange={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setLocation(+e.target.value)
                }}>
                {locations.map(l => (
                  <MenuItem value={l.location_id}>
                    {l.location_name}({l.location_city})
                  </MenuItem>
                ))}
                <MenuItem value={1}>hello</MenuItem>
              </Select>
              <Button
                variant="contained"
                sx={{ marginLeft: '0.5rem', flexBasis: 1, flexGrow: 1 }}>
                Dodaj Lokalizacj??
              </Button>
            </FormControl>
          </FormControl>
          <div></div>
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={handleClose}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isLoading} onClick={onSubmit}>
            Potwierd??
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
      <AddCountryPopup
        show={showCountry}
        handleClose={() => setShowCountry(false)}
        onError={() => {}}
        onSuccess={() => {
          setRefetch(!refetch)
        }}
      />
    </>
  )
}
