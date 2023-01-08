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
import React, { ComponentProps, useContext } from 'react'
import { getGlobalContext, isAuth } from '../state/global'

export interface TournamentsRouteProps {}

export const TournamentsRoute = ({}: TournamentsRouteProps) => {
  const isValidated = isAuth()

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
              {isValidated && <Button variant="contained">Dodaj</Button>}
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
