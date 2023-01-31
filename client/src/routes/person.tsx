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
import { DeletePopup } from '../views/person/DeletePopup'
import { AddCountryParticipantPopup } from '../views/tournament/AddCountryParticipation'
import { AddParticipant } from '../views/tournament/AddParticipant'
import { Stage } from '../views/tournament/Stage'

export const PersonRoute = () => {
  const match = useMatch('/person/:id')
  if (!match) {
    throw new Error("shouldn't happen")
  }

  // control
  const id = +(match.params.id || '0')
  const auth = isAuth()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // alert
  const alert = useAlert()
  const [showDelete, setShowDelete] = useState(false)

  // data
  const [tournaments, setTournaments] = useState<TournamentShortInfo[]>([])
  const [person, setPerson] = useState<PersonInfo>()
  const [refetch, setRefetch] = useState(false)

  const closeDelete = () => setShowDelete(false)

  // onMount
  useEffect(() => {
    setLoading(true)

    Promise.all([
      fetch_api(
        alert,
        'person/get',
        {
          ids: [id],
        },
        (data: PersonInfo[]) => setPerson(data[0]),
      ),
      fetch_api(
        alert,
        'person/get/tournaments',
        {
          id,
        },
        setTournaments,
      ),
    ]).finally(() => setLoading(false))
  }, [refetch])

  return loading ? (
    <Loader loading={loading} />
  ) : person ? (
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
                  {person?.person_first_name} {person?.person_last_name}
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
                      label: 'Narodowość',
                      value: `${person?.person_nationality_name} (${person?.person_nationality_code})`,
                      link: `/country/${person?.person_nationality_code}`,
                    },
                    {
                      label: 'Płeć',
                      value: person?.person_gender,
                    },
                    {
                      label: 'Liczba wystąpień',
                      value: `${person.person_participations}`,
                    },
                    {
                      label: 'Punkty pucharowe',
                      value: `${person?.person_points}`,
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
                Turnieje
              </ListView>
            </Paper>
          </Container>
        </Grid>
      </Box>
      <alert.AlertComponent />
      <DeletePopup
        person={person}
        show={showDelete}
        handleClose={closeDelete}
        onError={() => {}}
        onSuccess={() => navigate(-1)}
      />
    </>
  ) : (
    <Dialog open>
      <DialogTitle>Błąd wyszukiwania</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Nie znaleziono zawodnika(czki) o id = {id}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <LinkButton to="/">Strona Główna</LinkButton>
        <LinkButton to="/persons">Zawodnicy</LinkButton>
      </DialogActions>
    </Dialog>
  )
}
