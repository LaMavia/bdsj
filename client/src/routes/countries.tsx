import {
  Alert,
  AlertColor,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Navigate, useMatch, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import {
  ApiResponse,
  CountryEntryInfo,
  PersonInfo,
  TournamentInfo,
  TournamentShortInfo,
} from '../api'
import { LinkButton } from '../components/LinkButton'
import { ListView } from '../components/ListView'
import { Loader } from '../components/Loader'
import { TextProp, TextPropProps } from '../components/TextProp'
import { fetch_api } from '../helpers/promises'
import { isAuth } from '../state/global'
import { useAlert } from '../state/hooks'
import { DeletePopup } from '../views/person/DeletePopup'
export const CountriesRoute = () => {
  const auth = isAuth()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // alert
  const alert = useAlert()
  const [showDelete, setShowDelete] = useState(false)

  // data
  const [countries, setCountries] = useState<CountryEntryInfo[]>([])
  const [refetch, setRefetch] = useState(false)

  const closeDelete = () => setShowDelete(false)

  // onMount
  useEffect(() => {
    setLoading(true)
    fetch_api(alert, 'countries/get', {}, setCountries).finally(() =>
      setLoading(false),
    )
  }, [refetch])

  return loading ? (
    <Loader loading={loading} />
  ) : (
    <ListView
      data={countries}
      key_func={row => row.country_code}
      schema={[
        {
          key: 'country_code',
          align: 'left',
          display: 'Lp.',
          prim: (_, i) => `${i + 1}`,
        },
        {
          key: 'country_name',
          align: 'left',
          display: 'Nazwa',
          prim: row => (
            <Link
              style={{ color: 'inherit' }}
              to={`/country/${row.country_code}`}>
              {row.country_name}
            </Link>
          ),
        },
        {
          key: 'country_code',
          align: 'left',
          display: 'Kod',
        },
        {
          key: 'country_tournaments',
          align: 'right',
          display: 'Liczba turniejów wziętych udział',
        },
        {
          key: 'country_participants',
          align: 'right',
          display: 'Liczba reprezentujących zawodników',
        },
      ]}
      showBack>
      <Typography variant="h4">Kraje</Typography>
    </ListView>
  )
}
