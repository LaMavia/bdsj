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
  LocationInfo,
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
export const LocationsRoute = () => {
  const auth = isAuth()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // alert
  const alert = useAlert()
  const [showDelete, setShowDelete] = useState(false)

  // data
  const [locations, setLocations] = useState<LocationInfo[]>([])
  const [refetch, setRefetch] = useState(false)

  const closeDelete = () => setShowDelete(false)

  // onMount
  useEffect(() => {
    setLoading(true)
    fetch_api(alert, 'location/get', {}, setLocations).finally(() =>
      setLoading(false),
    )
  }, [refetch])

  return loading ? (
    <Loader loading={loading} />
  ) : (
    <ListView
      data={locations}
      key_func={row => `${row.location_id}`}
      schema={[
        {
          key: 'location_id',
          align: 'left',
          display: 'Lp.',
          prim: (_, i) => `${i + 1}`,
        },
        {
          key: 'location_name',
          align: 'left',
          display: 'Nazwa',
          prim: row => (
            <Link
              style={{ color: 'inherit' }}
              to={`/location/${row.location_id}`}>
              {row.location_name}
            </Link>
          ),
        },
        {
          key: 'location_city',
          align: 'left',
          display: 'Miasto',
        },
        {
          key: 'location_country_code',
          align: 'left',
          display: 'Kraj',
          prim: row => (
            <Link
              style={{ color: 'inherit' }}
              to={`/country/${row.location_country_code}`}>
              {row.location_country_code}
            </Link>
          ),
        },
      ]}
      showBack>
      <Typography variant="h4">Lokalizacje</Typography>
    </ListView>
  )
}
