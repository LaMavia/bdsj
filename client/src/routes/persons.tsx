import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { RoundEntry } from '../api'
import { ListView } from '../components/ListView'
import { fetch_api } from '../helpers/promises'
import { isAuth } from '../state/global'
import { useAlert } from '../state/hooks'

export const PersonsRoute = () => {
  // control
  const auth = isAuth()
  const [loading, setLoading] = useState(true)
  const [refetch, setRefetch] = useState(false)
  const alert = useAlert()
  const [entries, setEntries] = useState<RoundEntry[]>([])

  // onMount
  useEffect(() => {
    setLoading(true)
    fetch_api(alert, 'persons/get', {}, setEntries).finally(() =>
      setLoading(false),
    )
  }, [refetch])

  return (
    <ListView
      schema={[
        {
          key: 'position_final',
          align: 'left',
          display: 'Poz. kń.',
          default: '?',
        },
        { key: 'position_initial', align: 'left', display: 'Poz. st.' },
        { key: 'person_first_name', align: 'left', display: 'Imię' },
        { key: 'person_last_name', align: 'left', display: 'Nazwisko' },
        { key: 'participant_country_code', align: 'right', display: 'Kraj' },
        {
          key: 'jump_distance',
          align: 'right',
          display: 'Długość',
          default: 'DSQ',
          alt: 'disqualification_reason',
        },
        { key: 'jump_score', align: 'right', display: 'Ocena', default: '0' },
        { key: 'score', align: 'right', display: 'Punkty', default: '0' },
      ]}
      data={entries}
      key_func={e => e.participant_id}
      onChange={() => {}}
      onDelete={_ => {}}>
      <Typography variant="h4">Wyniki rundy</Typography>
    </ListView>
  )
}
