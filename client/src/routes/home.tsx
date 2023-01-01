import { Box, Paper, styled } from '@mui/material'

export const HomeRoute = () => {
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background: theme.palette.background.default,
    height: 100,
    padding: '0 20px',
    lineHeight: '100px',
    cursor: 'pointer'
  }))

  return (
    <>
      <Box
        sx={{
          p: 2,
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr' },
          gap: 2,
        }}>
        <Item
          elevation={2}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            alert('Ha ha! Pierw authentication!')
          }}>
          Organizatorzy
        </Item>
        <Item elevation={2}>Widzowie</Item>
      </Box>
    </>
  )
}
