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
import { PopupProps } from '../../components/PopupInterface'
import { API_URL } from '../../config'
import { useAlert } from '../../state/hooks'

export interface AddPersonParams {
  country_code?: string
}

export const AddPerson = ({
  show,
  country_code,
  handleClose,
  onSuccess,
  onError,
}: AddPersonParams & PopupProps) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [nationality, setNationality] = useState(country_code || '')

  const [countries, setCountries] = useState<CountryInfo[]>([])
  const [showCountry, setShowCountry] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(false)
  const alert = useAlert()

  // get countries
  useEffect(() => {
    setIsLoading(true)
    fetch(`${API_URL}?path=country/get`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(r => {
        if (!r.ok || r.status !== 200) {
          throw new TypeError(`country/get => ${r.statusText}`)
        }

        return r.json() as Promise<ApiResponse<CountryInfo[]>>
      })
      .then(r => {
        if (!r.ok) {
          throw new TypeError(r.error)
        }

        setCountries(r.data)
      })
      .catch((e: TypeError) => alert.display(e.message, 'error'))
      .finally(() => setIsLoading(false))
  }, [refetch])

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    const uri = `${API_URL}?path=person/post`
    fetch(uri, {
      body: JSON.stringify(
        {
          first_name: firstName,
          last_name: lastName,
          gender,
          nationality,
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
          const msg = 'poprawnie dodano uczestnika'
          alert.display(msg, 'success')

          // reset the form
          setGender('')
          setFirstName('')
          setLastName('')
          setNationality(country_code || '')

          handleClose()
          onSuccess(msg)
        } else {
          const msg = res.error || ''
          alert.display(msg, 'error')
          onError(msg)
        }
      })
      .catch((e: TypeError) => {
        alert.display(e.message, 'error')
        onError(e.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Dodawanie uczestnika</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              disabled={isLoading}
              autoFocus
              margin="dense"
              id="first_name"
              label="imię"
              type="text"
              fullWidth
              variant="standard"
              name="first_name"
              value={firstName}
              onChange={e => {
                setFirstName(e.target.value)
              }}
            />
            <TextField
              disabled={isLoading}
              autoFocus
              margin="dense"
              id="last_name"
              label="nazwisko"
              type="text"
              fullWidth
              variant="standard"
              name="last_name"
              value={lastName}
              onChange={e => {
                setLastName(e.target.value)
              }}
            />
            <FormControl fullWidth sx={{ flexFlow: 'row', marginTop: '1rem' }}>
              <InputLabel id="gender-label">Płeć</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                id="gender"
                sx={{ flexBasis: 4, flexGrow: 4 }}
                value={gender}
                onChange={e => {
                  setGender(e.target.value)
                }}>
                {['m', 'f', 'nb', 'na', 'gf', 'db', 'dg', 'ag'].map(g => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ flexFlow: 'row', marginTop: '1rem' }}>
              <InputLabel id="country-label">Kraj</InputLabel>
              <Select
                labelId="country-label"
                name="country"
                id="country"
                sx={{ flexBasis: 4, flexGrow: 4 }}
                value={nationality}
                onChange={e => {
                  setNationality((e.target.value as string | undefined) || '')
                }}>
                {countries.map(c => (
                  <MenuItem key={c.country_code} value={c.country_code}>
                    {c.country_name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                sx={{ marginLeft: '0.5rem', flexBasis: 1, flexGrow: 1 }}
                onClick={e => {
                  setShowCountry(true)
                }}>
                Dodaj Kraj
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
            Potwierdź
          </Button>
        </DialogActions>
        <alert.AlertComponent />
      </Dialog>
    </>
  )
}
