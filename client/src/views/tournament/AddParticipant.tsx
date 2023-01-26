import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  ApiResponse,
  CountryInfo,
  PersonShortInfo,
  TournamentInfo,
} from '../../api'
import { PopupProps } from '../../components/PopupInterface'
import { API_URL } from '../../config'
import { isAuth } from '../../state/global'
import { useAlert, useCounter } from '../../state/hooks'
import { AddCountryPopup } from '../tournaments/AddCountryPopup'
import { AddPopup as AddTournamentPopup } from '../tournaments/AddPopup'
import { AddPerson } from './AddPerson'

export interface AddParticipantProps extends PopupProps {
  country_code: string
  tournament_id: number
}

export const AddParticipant = ({
  country_code,
  tournament_id,
  show,
  onSuccess,
  onError,
  handleClose,
}: AddParticipantProps) => {
  const auth = isAuth()

  const [loading, setLoading] = useState(false)
  const [refetch, setRefetch] = useState(false)

  const [countryCode, setCountryCode] = useState(country_code)
  const [countries, setCountries] = useState<CountryInfo[]>([])
  const [showCountry, setShowCountry] = useState(false)

  const [tournamentId, setTournamentId] = useState(tournament_id)
  const [tournaments, setTournaments] = useState<TournamentInfo[]>([])
  const [showAddTournament, setShowAddTournament] = useState(false)

  const [persons, setPersons] = useState<PersonShortInfo[]>([])
  const [personId, setPersonId] = useState(0)
  const [showAddPerson, setShowAddPerson] = useState(false)

  const alert = useAlert()

  // get tournaments
  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}?path=tournament/get`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(r => {
        if (!r.ok || r.status !== 200) {
          throw new TypeError(`tournament/get => ${r.statusText}`)
        }

        return r.json() as Promise<ApiResponse<TournamentInfo[]>>
      })
      .then(r => {
        if (!r.ok) {
          throw new TypeError(r.error)
        }

        setTournaments(r.data)
      })
      .catch((e: TypeError) => alert.display(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [refetch])

  // get countries
  useEffect(() => {
    setLoading(true)
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
      .finally(() => setLoading(false))
  }, [refetch, tournamentId])

  // get persons
  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}?path=person/get/short`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        nationalities: [countryCode]
      }, null, 0)
    })
      .then(r => {
        if (!r.ok || r.status !== 200) {
          throw new TypeError(`${r.url} => ${r.statusText}`)
        }

        return r.json() as Promise<ApiResponse<PersonShortInfo[]>>
      })
      .then(r => {
        if (!r.ok) {
          throw new TypeError(r.error)
        }

        setPersons(r.data)
      })
      .catch((e: TypeError) => alert.display(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [refetch, countryCode])

  const onSubmit = () => {
    // setLoading(true)
    // fetch(`${API_URL}?path=`)
  }

  return (
    <>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Dodaj zgłoszenie {loading}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ minWidth: '500px' }}>
            <FormControl fullWidth sx={{ flexFlow: 'row', marginTop: '1rem' }}>
              <InputLabel id="tournament-label">Turniej</InputLabel>
              <Select
                labelId="tournament-label"
                name="tournament"
                id="tournament"
                sx={{ flexBasis: 4, flexGrow: 4 }}
                value={tournamentId}
                onChange={e => {
                  setTournamentId(+e.target.value || tournament_id)
                }}>
                {tournaments.map(t => (
                  <MenuItem key={t.tournament_id} value={t.tournament_id}>
                    {t.tournament_name} ({t.tournament_year})
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                sx={{ marginLeft: '0.5rem', flexBasis: 1, flexGrow: 1 }}
                onClick={_ => {
                  setShowAddTournament(true)
                }}>
                Dodaj Turniej
              </Button>
            </FormControl>
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
                onClick={_ => {
                  setShowCountry(true)
                }}>
                Dodaj Kraj
              </Button>
            </FormControl>
            <FormControl fullWidth sx={{ flexFlow: 'row', marginTop: '1rem' }}>
              <InputLabel id="person-label">Uczestnik</InputLabel>
              <Select
                labelId="person-label"
                name="person"
                id="person"
                sx={{ flexBasis: 4, flexGrow: 4 }}
                value={personId}
                onChange={e => {
                  setPersonId(+e.target.value || 0)
                }}>
                {persons.map(p => (
                  <MenuItem key={p.person_id} value={p.person_id}>
                    {p.person_first_name} {p.person_last_name} (
                    {p.person_gender})
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                sx={{ marginLeft: '0.5rem', flexBasis: 1, flexGrow: 1 }}
                onClick={_ => {
                  setShowAddPerson(true)
                }}>
                Dodaj Uczestnika
              </Button>
            </FormControl>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>
            Anuluj
          </Button>
          <Button type="submit" disabled={loading} onClick={onSubmit}>
            Potwierdź
          </Button>
        </DialogActions>
        <alert.AlertComponent />
        <AddCountryPopup
          show={showCountry}
          handleClose={() => setShowCountry(false)}
          onError={() => {}}
          onSuccess={() => {
            setRefetch(!refetch)
          }}
        />
        <AddTournamentPopup
          handleClose={() => setShowAddTournament(false)}
          show={showAddTournament}
          onError={() => {}}
          onSuccess={() => {
            setRefetch(!refetch)
          }}
        />
        <AddPerson
          handleClose={() => setShowAddPerson(false)}
          show={showAddPerson}
          onError={() => {}}
          onSuccess={() => {
            setRefetch(!refetch)
          }}
        />
      </Dialog>
    </>
  )
}
