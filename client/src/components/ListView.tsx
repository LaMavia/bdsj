import {
  Button,
  ButtonGroup,
  FormGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
  Typography,
} from '@mui/material'
import { Box, Container, SxProps } from '@mui/system'
import { PropsWithChildren, ReactElement, useState } from 'react'
import { useNavigate } from 'react-router'
import { isAuth } from '../state/global'

export type FieldSchema<T> = {
  key: keyof T
  align: 'left' | 'right'
  display: string
  default?: string
  alt?: (row: T, i: number) => JSX.Element | string
  prim?: (row: T, i: number) => JSX.Element | string
  onlyEdit?: boolean
  deserialize?: (x: string) => any
  render?: (x: any) => JSX.Element
}

export type ListViewParams<T> = {
  schema: FieldSchema<T>[]
  data: T[]
  key_func: (entry: T) => string
  onDelete: (key: string) => void
  onCommit?: (changedRows: T[]) => Promise<void>
  sx?: SxProps<any>
  showBack?: boolean
}

export function ListView<T>({
  schema,
  data,
  key_func,
  onCommit,
  children,
  ...props
}: PropsWithChildren<ListViewParams<T>>) {
  const auth = isAuth()
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const [changedRows, setChangedRows] = useState<{
    [key: string]: { [P in keyof T]?: string | T[P] }
  }>({})

  const onChange = (row: T, field: FieldSchema<T>, val: string) => {
    if (!field.deserialize) return

    const key = key_func(row)
    const mod_row = key in changedRows ? changedRows[key] : { ...row }
    mod_row[field.key] = val

    setChangedRows({ [key]: mod_row, ...changedRows })
  }

  const handleCommit = () => {
    if (!onCommit) return

    const lookup = schema.reduce(
      (u, s) => (s.deserialize ? { [s.key]: s.deserialize, ...u } : u),
      {} as { [P in keyof T]: (x: string) => T[P] },
    )

    setEdit(false)
    onCommit(
      Object.values(changedRows).map(row => {
        for (const k in row) {
          if (k in lookup && typeof row[k] === 'string') {
            row[k] = lookup[k](row[k] as string)
          }
        }

        return row as T
      }),
    ).then(() => setChangedRows({}))
  }

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
            sx={
              props?.sx || {
                maxWidth: '926px',
                width: '70vw',
                minWidth: '926px',
              }
            }>
            <Paper
              sx={{ padding: '1rem', marginBottom: '0.5rem' }}
              elevation={3}>
              <FormGroup
                sx={{ justifyContent: 'space-between', flexFlow: 'row' }}>
                {children}
                <ButtonGroup>
                  {props.showBack && (
                    <Button onClick={_ => navigate(-1)}>Wróć</Button>
                  )}
                  {auth && onCommit && (
                    <>
                      <Button
                        onClick={_ => setEdit(!edit)}
                        color={!edit ? 'primary' : 'error'}>
                        {!edit ? 'Edytuj' : 'Anuluj'}
                      </Button>
                      {edit && (
                        <Button color="primary" onClick={handleCommit}>
                          Zapisz
                        </Button>
                      )}
                    </>
                  )}
                </ButtonGroup>
              </FormGroup>
            </Paper>
            <TableContainer
              component={Paper}
              elevation={2}
              sx={{ maxHeight: '80vh', overflowY: 'scroll' }}>
              <Table sx={{ minWidth: 750 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {schema.map(
                      s =>
                        (!s.onlyEdit || (s.onlyEdit && edit)) && (
                          <TableCell align={s.align}>{s.display}</TableCell>
                        ),
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={`${key_func(row)}`}>
                      {schema.map(s =>
                        s.deserialize && edit ? (
                          <TableCell
                            key={`${String(s.key)}+${key_func(row)}`}
                            align={s.align}>
                            <TextField
                              value={
                                (key_func(row) in changedRows
                                  ? changedRows[key_func(row)][s.key]
                                  : row[s.key]) || ''
                              }
                              onChange={e => {
                                e.preventDefault()
                                onChange(row, s, e.target.value)
                              }}
                            />
                          </TableCell>
                        ) : !s.onlyEdit ? (
                          <TableCell
                            key={`${String(s.key)}+${key_func(row)}`}
                            align={s.align}>
                            {s.render
                              ? s.render(row[s.key])
                              : s?.prim
                              ? s.prim(row, i)
                              : `${
                                  row[s.key] === undefined ||
                                  row[s.key] === null
                                    ? s?.alt
                                      ? s.alt(row, i)
                                      : s?.default
                                    : row[s.key]
                                }`}
                          </TableCell>
                        ) : (
                          <></>
                        ),
                      )}
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
