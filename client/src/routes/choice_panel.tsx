import { Box } from '@mui/system'
import { NavLink } from 'react-router-dom'
import { Tile } from '../components/Tile'

export const ChoicePanelRoute = () => (
  <Box
    sx={{
      p: 2,
      display: 'grid',
      gridTemplateColumns: { md: '1fr 1fr' },
      gap: 2,
    }}>
    <NavLink to="../tournaments">
      <Tile elevation={2}>Turnieje</Tile>
    </NavLink>
    <NavLink to="../people">
      <Tile elevation={2}>Zawodnicy</Tile>
    </NavLink>
    <NavLink to="../countries">
      <Tile elevation={2}>Kraje</Tile>
    </NavLink>
    <NavLink to="../locations">
      <Tile elevation={2}>Lokalizacje</Tile>
    </NavLink>
  </Box>
)
