import { Dialog, DialogContent, DialogTitle } from '@mui/material'
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
import { useAlert } from '../../state/hooks'

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

  const [loading, setLoading] = useState(0)
  const [refetch, setRefetch] = useState(false)

  const [countryCode, setCountryCode] = useState(country_code)
  const [countries, setCountries] = useState<CountryInfo[]>([])

  const [tournamentId, setTournamentId] = useState(tournament_id)
  const [tournaments, setTournaments] = useState<TournamentInfo[]>([])

  const [persons, setPersons] = useState<PersonShortInfo[]>([])
  const [personId, setPersonId] = useState(0)

  const alert = useAlert()

  // get tournaments
  useEffect(() => {
    setLoading(loading + 1)
    fetch(`${API_URL}?path=tournaments/get`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(r => {
        if (!r.ok || r.status !== 200) {
          throw new TypeError(`tournaments/get => ${r.statusText}`)
        }

        return r.json() as Promise<ApiResponse<TournamentInfo[]>>
      })
      .then(r => {
        if (!r.ok) {
          throw new TypeError(r.error)
        }

        setTournaments(r.data)
      })
      .catch((e: TypeError) => {})
    alert.display('Hello', 'info')
  }, [refetch])

  return (
    <>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Dodaj zgłoszenie</DialogTitle>
        <DialogContent>Hello!</DialogContent>
        <alert.AlertComponent />
      </Dialog>
    </>
  )
}
