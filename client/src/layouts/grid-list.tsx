import { Box, Breadcrumbs, Container, Grid, Paper, styled } from '@mui/material'
import 'react'
import { Outlet } from 'react-router'

export const GridListLayout = () => {
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
          // direction="row"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh', padding: '0 20%', width: '100vw' }}
          direction="column">
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'row',
              flexWrap: 'wrap',
              justifyContent: 'start',
              gap: 5,
              border: 'red 5px solid',
            }}>
            <Outlet />
          </Box>
        </Grid>
      </StyledContainer>
    </>
  )
}
