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
import { useAlert } from '../../state/hooks'
import { AddCountryPopup } from '../tournaments/AddCountryPopup'
// import { AddLocationPopup } from './AddLocationPopup'

export interface AddPopupParams {
  show: boolean
  handleClose: () => void
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
  tournament_id: number
}

export const AddPopup = ({
  show,
  handleClose,
  onSuccess,
  onError,
  tournament_id,
}: AddPopupParams) => {
  const [limit, setLimit] = useState(2)
  const [countryCode, setCountryCode] = useState('')
  const [refetch, setRefetch] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const alert = useAlert()
  const [countries, setCountries] = useState<CountryInfo[]>([])

  const [showCountry, setShowCountry] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    Promise.all(
      [['country/get', 'POST']].map(([path, method]) =>
        fetch(`${API_URL}?path=${path}`, {
          method,
          credentials: 'include',
        }),
      ),
    )
      .then(rs => {
        if (rs[0].status !== 200) {
          throw new TypeError(
            rs.map(r => `${r.url} => ${r.statusText}`).join(',\n'),
          )
        }

        return Promise.all(rs.map(r => r.json())) as Promise<[any]>
      })
      .then(([cou_r]: [ApiResponse<CountryInfo[], string>]) => {
        let err = ''

        if (cou_r.ok) {
          setCountries(cou_r.data)
        } else {
          err += `country/get => ${cou_r.error}`
        }

        if (err) {
          alert.display(err, 'error')
        }
      })
      .catch((e: Error) => {
        alert.display(e.message, 'error')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [refetch])

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    const uri = `${API_URL}?path=lim/post`
    fetch(uri, {
      body: JSON.stringify(
        {
          amount: limit,
          country_code: countryCode,
          tournament_id,
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
          const msg = 'poprawnie dodano kraj uczestniczący'
          alert.display(msg, 'success')
          onSuccess(msg)
          handleClose()

          // reset the form
          setLimit(2)
          setCountryCode('')
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
        <DialogTitle>Dodawanie turnieju</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ minWidth: '500px' }}>
            <FormControl fullWidth sx={{ flexFlow: 'row', marginTop: '1rem' }}>
              <InputLabel id="country-label">Kraj</InputLabel>
              <Select
                labelId="country-label"
                name="country"
                id="country"
                sx={{ flexBasis: 4, flexGrow: 4 }}
                value={countryCode}
                onChange={e => {
                  setCountryCode((e.target.value as string | undefined) || '')
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
            <TextField
              disabled={isLoading}
              margin="dense"
              id="limit"
              label="Kwota startowa"
              type="number"
              fullWidth
              variant="standard"
              name="limit"
              value={limit}
              onChange={e => {
                setLimit(+e.target.value)
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
        <alert.AlertComponent />
      </Dialog>
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
