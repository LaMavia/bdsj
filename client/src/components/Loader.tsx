import { Box, CircularProgress } from '@mui/material'

export interface LoaderProps {
  loading: boolean
}

export const Loader = ({ loading }: LoaderProps) =>
  loading ? (
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
  ) : (
    <></>
  )
