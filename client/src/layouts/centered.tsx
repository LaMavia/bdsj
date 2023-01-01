import { Container, Grid, Paper, styled } from '@mui/material'
import 'react'
import { Outlet } from 'react-router'
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
