import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { PersonEntry, RoundEntry } from '../api'
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
  const [entries, setEntries] = useState<PersonEntry[]>([])

  // onMount
  useEffect(() => {
    setLoading(true)
    fetch_api(alert, 'person/get/short', {}, setEntries).finally(() =>
      setLoading(false),
    )
  }, [refetch])

  return (
    <ListView
      showBack
      schema={[
        {
          key: 'person_id',
          display: 'Lp.',
          align: 'left',
          prim: (_, i) => `${i + 1}`,
        },
        {
          key: 'person_first_name',
          align: 'left',
          display: 'Imię',
          prim: row => (
            <Link style={{ color: 'inherit' }} to={`/person/${row.person_id}`}>
              {row.person_first_name}
            </Link>
          ),
        },
        {
          key: 'person_last_name',
          align: 'left',
          display: 'Nazwisko',
          prim: row => (
            <Link style={{ color: 'inherit' }} to={`/person/${row.person_id}`}>
              {row.person_last_name}
            </Link>
          ),
        },
        {
          key: 'person_gender',
          align: 'right',
          display: 'Płeć',
        },
        {
          key: 'person_nationality',
          align: 'right',
          display: 'Narodowość',
          prim: row => (
            <Link
              style={{ color: 'inherit' }}
              to={`/country/${row.person_nationality}`}>
              {row.person_nationality}
            </Link>
          ),
        },
        {
          key: 'person_points',
          align: 'right',
          display: 'Punkty Pucharowe',
        },
      ]}
      data={entries}
      key_func={e => String(e.person_id)}
      onDelete={_ => {}}>
      <Typography variant="h4">Zawodnicy</Typography>
    </ListView>
  )
}
