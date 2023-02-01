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
  CountryDescInfo,
  CountryEntryInfo,
  PersonInfo,
  TournamentInfo,
  TournamentShortInfo,
} from '../api'
import { LinkButton } from '../components/LinkButton'
import { ListView } from '../components/ListView'
import { Loader } from '../components/Loader'
import { TextProp, TextPropProps } from '../components/TextProp'
import { API_URL } from '../config'
import { fetch_api } from '../helpers/promises'
import { isAuth } from '../state/global'
import { useAlert } from '../state/hooks'
import { DeletePopup } from '../views/country/DeletePopup'
import { AddCountryParticipantPopup } from '../views/tournament/AddCountryParticipation'
import { AddParticipant } from '../views/tournament/AddParticipant'
import { Stage } from '../views/tournament/Stage'

export const CountryRoute = () => {
  const match = useMatch('/country/:id')
  if (!match) {
    throw new Error("shouldn't happen")
  }

  // control
  const id = match.params.id || ''
  const auth = isAuth()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // alert
  const alert = useAlert()
  const [showDelete, setShowDelete] = useState(false)

  // data
  const [tournaments, setTournaments] = useState<TournamentShortInfo[]>([])
  const [country, setCountry] = useState<CountryDescInfo>()
  const [refetch, setRefetch] = useState(false)

  const closeDelete = () => setShowDelete(false)

  // onMount
  useEffect(() => {
    setLoading(true)

    Promise.all([
      fetch_api(
        alert,
        'country/get/desc',
        {
          code: id,
        },
        setCountry,
      ),
      fetch_api(
        alert,
        'country/get/tournaments',
        {
          code: id,
        },
        setTournaments,
      ),
    ]).finally(() => setLoading(false))
  }, [refetch])

  return loading ? (
    <Loader loading={loading} />
  ) : country ? (
    <>
      <Box
        sx={{
          width: '100%',
        }}>
        <Grid
          item
          sx={{
            flexFlow: 'row',
          }}>
          <Container
            sx={{ maxWidth: '926px', width: '80vw', minWidth: '926px' }}>
            <Paper
              elevation={12}
              sx={{ padding: '20px', marginBottom: '10px' }}>
              <FormGroup
                sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography
                  variant="h4"
                  fontSize={'32px'}
                  lineHeight={1.5}
                  component="span">
                  {country?.country_name}
                </Typography>
                {auth && (
                  <ButtonGroup>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={_ => setShowDelete(true)}>
                      Usuń
                    </Button>
                  </ButtonGroup>
                )}
              </FormGroup>
            </Paper>
            <Paper elevation={5} sx={{ marginBottom: '10px' }}>
              <List sx={{ maxHeight: '70vh', overflowY: 'scroll' }}>
                {(
                  [
                    {
                      label: 'Kod',
                      value: country.country_code,
                    },
                    {
                      label: 'Liczba zawodników',
                      value: country.country_participants,
                    },
                    {
                      label: 'Liczba zawodników obywateli',
                      value: country.country_nationals,
                    },
                    {
                      label: 'Liczba konkursów branych udział',
                      value: country.country_tournaments,
                    },
                    {
                      label: 'Suma punktów pucharowych',
                      value: country.country_points,
                    },
                  ] as TextPropProps[]
                ).map(p => (
                  <TextProp {...p} />
                ))}
              </List>
            </Paper>
            <Paper>
              <ListView
                sx={{ width: '100%', minWidth: 0 }}
                data={tournaments}
                key_func={row => `${row.tournament_id}`}
                onDelete={() => {}}
                schema={[
                  {
                    key: 'tournament_id',
                    display: 'Lp.',
                    align: 'left',
                    prim: (_, i) => `${i + 1}`,
                  },
                  {
                    key: 'tournament_name',
                    display: 'Nazwa',
                    align: 'left',
                    prim: row => (
                      <Link
                        style={{ color: 'inherit' }}
                        to={`/tournament/${row.tournament_id}`}>
                        {row.tournament_name}
                      </Link>
                    ),
                  },
                  {
                    key: 'tournament_year',
                    display: 'Rok',
                    align: 'left',
                  },
                  {
                    key: 'tournament_location_id',
                    display: 'Lokalizacja',
                    align: 'right',
                    prim: row => (
                      <Link
                        style={{ color: 'inherit' }}
                        to={`/location/${row.tournament_location_id}`}>
                        {row.tournament_location_name} (
                        {row.tournament_location_city})
                      </Link>
                    ),
                  },
                  {
                    key: 'tournament_host',
                    display: 'Organizator',
                    align: 'right',
                    prim: row => (
                      <Link
                        style={{ color: 'inherit' }}
                        to={`/country/${row.tournament_host}`}>
                        {row.tournament_host}
                      </Link>
                    ),
                  },
                ]}>
                <Typography variant="h5">Turnieje</Typography>
              </ListView>
            </Paper>
          </Container>
        </Grid>
      </Box>
      <alert.AlertComponent />
      <DeletePopup
        country={country}
        show={showDelete}
        handleClose={closeDelete}
        onError={() => {}}
        onSuccess={() => {
          setRefetch(!refetch)
          navigate(-1)
        }}
      />
    </>
  ) : (
    <Dialog open>
      <DialogTitle>Błąd wyszukiwania</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Nie znaleziono kraju o kodzie = {id}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <LinkButton to="/">Strona Główna</LinkButton>
        <LinkButton to="/persons">Zawodnicy</LinkButton>
      </DialogActions>
    </Dialog>
  )
}
