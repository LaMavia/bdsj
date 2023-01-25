import { Button, Container, Grid, Paper, styled } from '@mui/material'
import 'react'
import { Outlet } from 'react-router'
import HomeIcon from '@mui/icons-material/Home'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
// import {} from "@mui/material"

export const CenteredLayout = () => {
  const StyledContainer = styled(Paper)(({ theme }) => ({
    height: '100vh',
    width: '100vw',
    boxShadow: '',
    margin: 0,
  }))

  return (
    <>
      <Button
        sx={{
          display: 'flex',
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          width: '3.5rem',
          height: '3.5rem',
          padding: 0,
        }}>
        <Paper
          elevation={5}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          <Link
            to="/"
            style={{
              color: 'inherit',
              textDecoration: 'none',
            }}>
            <HomeIcon sx={{ fontSize: '2.5rem' }} />
          </Link>
        </Paper>
      </Button>
      <StyledContainer>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}>
          <Outlet />
        </Grid>
      </StyledContainer>
    </>
  )
}
