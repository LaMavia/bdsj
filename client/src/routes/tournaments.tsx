import styled from '@emotion/styled'
import {
  Button,
  Container,
  FormGroup,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { ComponentProps, useContext, useEffect, useState } from 'react'
import { ApiResponse, TournamentInfo } from '../api'
import { API_URL } from '../config'
import { getGlobalContext, isAuth } from '../state/global'

export interface TournamentsRouteProps {}

export const TournamentsRoute = ({}: TournamentsRouteProps) => {
  const auth = isAuth()
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [tournaments, setTournaments] = useState<TournamentInfo[]>([])

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
        setLoading(false)
        if (!res.ok) {
          setAlertMsg(res.error)
          setShowAlert(true)
        } else {
          closeAlert()
          setTournaments(res.data)
        }
      })
  }, [])

  return (
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
          <Paper elevation={12} sx={{ padding: '20px', marginBottom: '10px' }}>
            <FormGroup
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography
                variant="h4"
                fontSize={'32px'}
                lineHeight={1.5}
                component="span">
                Turnieje
              </Typography>
              {auth && <Button variant="contained">Dodaj</Button>}
            </FormGroup>
          </Paper>
          <Paper elevation={5}>
            <List sx={{ maxHeight: '70vh', overflowY: 'scroll' }}>
              {new Array(10)
                .fill(0)
                .map((_, i) => i)
                .map(v => (
                  <ListItem>
                    <ListItemText
                      primary={`Some longer text ${v}`}
                      secondary="Secondary text"
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Container>
      </Grid>
    </Box>
  )
}
