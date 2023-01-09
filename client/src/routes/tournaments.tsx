import styled from '@emotion/styled'
import {
  Alert,
  AlertColor,
  Button,
  ButtonGroup,
  CircularProgress,
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
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, {
  ComponentProps,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  ApiResponse,
  DeleteApiResponse,
  PutApiResponse,
  TournamentInfo,
} from '../api'
import { API_URL } from '../config'
import { getGlobalContext, isAuth } from '../state/global'
import { AddPopup } from '../views/tournaments/AddPopup'
import { DeletePopup } from '../views/tournaments/DeletePopup'

export interface TournamentsRouteProps {}

export const TournamentsRoute = ({}: TournamentsRouteProps) => {
  const auth = isAuth()
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [tournaments, setTournaments] = useState<TournamentInfo[]>([])
  const [tournament, setTournament] = useState<TournamentInfo | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [refetch, setRefetch] = useState(false)

  const closeAlert = () => {
    setShowAlert(false)
  }

  // onMount
  useEffect(() => {
    fetch(`${API_URL}?path=tournament/get`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(r => r.json())
      .then((res: ApiResponse<TournamentInfo[], string>) => {
        if (!res.ok) {
          setAlertMsg(res.error)
          setShowAlert(true)
        } else {
          closeAlert()
          setTournaments(res.data)
        }
        setLoading(false)
      })
  }, [refetch])

  return (
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
          <Container sx={{ width: '40%', minWidth: '726px' }}>
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
                  Turnieje
                </Typography>
                {auth && (
                  <Button
                    variant="contained"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowAdd(true)
                    }}>
                    Dodaj
                  </Button>
                )}
              </FormGroup>
            </Paper>
            <Paper elevation={5}>
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    height: '500px',
                    justifyContent: 'space-around',
                    flexFlow: 'column',
                  }}>
                  <CircularProgress sx={{ margin: 'auto' }} />
                </Box>
              ) : tournaments.length ? (
                <List sx={{ maxHeight: '70vh', overflowY: 'scroll' }}>
                  {tournaments.map(t => (
                    <ListItem>
                      <ListItemText
                        primary={`${t.tournament_name} (${t.tournament_year}, ${t.tournament_location_city})`}
                        secondary="Secondary text"
                      />
                      <ButtonGroup variant="contained">
                        <Button color="primary">info</Button>
                        <Button
                          onClick={e => {
                            e.stopPropagation()
                            e.preventDefault()
                            setTournament(t)
                            setShowDelete(true)
                          }}
                          color="error">
                          usuń
                        </Button>
                      </ButtonGroup>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    padding: '20px',
                  }}>
                  Brak turniejów
                </Typography>
              )}
            </Paper>
          </Container>
        </Grid>
      </Box>
      <DeletePopup
        handleClose={() => setShowDelete(false)}
        show={showDelete}
        tournament={tournament}
        onError={() => {}}
        onSuccess={() => {
          setRefetch(!refetch)
        }}
      />
      <AddPopup
        handleClose={() => setShowAdd(false)}
        show={showAdd}
        onError={() => {}}
        onSuccess={() => {
          setRefetch(!refetch)
        }}
      />
    </>
  )
}
