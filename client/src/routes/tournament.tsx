import {
  Alert,
  AlertColor,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
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
import { ApiResponse, TournamentInfo } from '../api'
import { LinkButton } from '../components/LinkButton'
import { Loader } from '../components/Loader'
import { API_URL } from '../config'
import { isAuth } from '../state/global'
import { AddCountryParticipantPopup } from '../views/tournament/AddCountryParticipation'
import { AddParticipant } from '../views/tournament/AddParticipant'
import { DeletePopup } from '../views/tournaments/DeletePopup'

interface TextPropProps {
  label: string
  value: string
  link: string
}
const TextProp = ({ label, value, link }: TextPropProps) => (
  <ListItem sx={{ display: 'block' }}>
    <ListItemText>{label}:</ListItemText>
    <ListItemText>
      <Link style={{ color: 'inherit' }} to={link}>
        {value}
      </Link>
    </ListItemText>
  </ListItem>
)

export const TournamentRoute = () => {
  const match = useMatch('/tournament/:id')
  if (!match) {
    throw new Error("shouldn't happen")
  }

  // control
  const id = +(match.params.id || '0')
  const auth = isAuth()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // alert
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')

  // delete popup
  const [showDelete, setShowDelete] = useState(false)
  // add popup
  const [showAdd, setShowAdd] = useState(false)

  // data
  const [tournament, setTournament] = useState<TournamentInfo>()
  const [refetch, setRefetch] = useState(false)

  // add participant popup
  const [showAddParticipant, setShowAddParticipant] = useState(false)
  const [countryCode, setCountryCode] = useState(
    tournament?.tournament_host_code || '',
  )

  const closeDelete = () => setShowDelete(false)
  const closeAdd = () => setShowAdd(false)
  const closeAddParticipant = () => setShowAddParticipant(false)
  const display = (msg: string, severity: AlertColor) => {
    setAlertMsg(msg)
    setAlertSeverity(severity)
    setShowAlert(true)
  }

  // onMount
  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}?path=tournament/get`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        ids: [id],
      }),
    })
      .then(r => {
        if (r.status !== 200) {
          throw new TypeError(r.statusText)
        }

        return r.json() as Promise<ApiResponse<TournamentInfo[], string>>
      })
      .then(r => {
        if (!r.ok) {
          throw new TypeError(r.error)
        }

        if (!r.data.length) {
          throw new TypeError(`Invalid id=${id}`)
        }

        setTournament(r.data[0])
        setCountryCode(r.data[0].tournament_host_code)
      })
      .catch((e: TypeError) => {
        setAlertMsg(e.message)
        setShowAlert(true)
        setAlertSeverity('error')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [refetch])

  return loading ? (
    <Loader loading={loading} />
  ) : tournament ? (
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
          <Container sx={{ maxWidth: '926px', width: '50vw', minWidth: '826px' }}>
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
                  {tournament?.tournament_name}
                </Typography>
                {auth && (
                  <ButtonGroup>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={_ => {
                        setShowAddParticipant(true)
                      }}>
                      Dodaj zgłoszenie
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={_ => {
                        setShowAdd(true)
                      }}>
                      Dodaj kraj
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={_ => {
                        setShowDelete(true)
                      }}>
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
                      label: 'Lokalizacja',
                      value: `${tournament?.tournament_location_name} (${tournament?.tournament_location_city})`,
                      link: `/location/${tournament?.tournament_location_id}`,
                    },
                    {
                      label: 'Organizator',
                      value: tournament?.tournament_host_name,
                      link: `/country/${tournament?.tournament_host_code}`,
                    },
                    {
                      label: 'Liczba zgłoszeń',
                      value: `${tournament?.tournament_participant_count}/${tournament?.tournament_total_tickets}`,
                      link: `/participants/${id}`,
                    },
                    {
                      label: 'Liczba zgłoszonych krajów',
                      value: tournament?.tournament_country_count,
                      link: `/countries/${id}`,
                    },
                  ] as TextPropProps[]
                ).map(p => (
                  <TextProp {...p} />
                ))}
              </List>
            </Paper>
            <Paper elevation={5}>
              <List sx={{ maxHeight: '70vh', overflowY: 'scroll' }}></List>
            </Paper>
          </Container>
        </Grid>
      </Box>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}>
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertSeverity}
          sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
      <DeletePopup
        show={showDelete}
        handleClose={closeDelete}
        onError={() => {}}
        onSuccess={() => navigate(-1)}
        tournament={tournament as TournamentInfo}
      />
      <AddCountryParticipantPopup
        show={showAdd}
        handleClose={closeAdd}
        onError={() => {}}
        onSuccess={msg => (display(msg, 'success'), setRefetch(!refetch))}
        tournament_id={tournament.tournament_id}
      />
      <AddParticipant
        country_code={countryCode}
        tournament_id={id}
        show={showAddParticipant && countryCode !== ''}
        onSuccess={msg => {
          display(msg, 'success')
          setRefetch(!refetch)
        }}
        onError={msg => display(msg, 'error')}
        handleClose={closeAddParticipant}
      />
    </>
  ) : (
    <Dialog open>
      <DialogTitle>Błąd wyszukiwania</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Nie znaleziono turnieju o id = {id}
        </DialogContentText>
        <DialogContentText>{alertMsg}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <LinkButton to="/">Strona Główna</LinkButton>
        <LinkButton to="/tournaments">Turnieje</LinkButton>
      </DialogActions>
    </Dialog>
  )
}
