import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Box, Container } from '@mui/system'
import { PropsWithChildren } from 'react'

export type ListViewParams<T, K> = {
  schema: {
    key: keyof T
    align: 'left' | 'right'
    display: string
    default?: string
    alt?: keyof T
  }[]
  data: T[]
  key_func: (entry: T) => K
  onDelete: (key: K) => void
  onChange: () => void
}

export function ListView<T, K>({
  schema,
  data,
  key_func,
  onDelete,
  onChange,
  children,
}: PropsWithChildren<ListViewParams<T, K>>) {
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
          <Container
            sx={{
              maxWidth: '926px',
              width: '50vw',
              minWidth: '826px',
            }}>
            <Paper>
              {children}
            </Paper>
            <TableContainer
              component={Paper}
              elevation={2}
              sx={{ maxHeight: '80vh', overflowY: 'scroll' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {schema.map(({ align, display }) => (
                      <TableCell align={align}>{display}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(row => (
                    <TableRow key={`${key_func(row)}`}>
                      {schema.map(({ align, key, display, ...s }) => (
                        <TableCell align={align}>
                          {`${
                            row[key] === undefined || row[key] === null
                              ? 'alt' in s
                                ? `${s?.default}:${row[s.alt as keyof T]}`
                                : s?.default
                              : row[key]
                          }`}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Grid>
      </Box>
    </>
  )
}
