import {
  Button,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import { Container } from '@mui/system'
import { useEffect, useState } from 'react'
import { RoundShort, StageInfo } from '../../api'
import { Loader } from '../../components/Loader'
import { TextProp } from '../../components/TextProp'
import { fetch_api } from '../../helpers/promises'
import { isAuth } from '../../state/global'
import { AlertState, useAlert } from '../../state/hooks'

export interface StageProps {
  alert: AlertState
  tournament_id: number
}

interface RoundDescriptorProps {
  name: string
  round?: RoundShort
}
const RoundDescriptor = ({ round, name }: RoundDescriptorProps) =>
  !round ? (
    <></>
  ) : (
    <TextProp
      label={name}
      value={`Data: ${round.round_date}`}
      link={`/round/${round.round_id}`}
    />
  )

export const Stage = ({ alert, tournament_id }: StageProps) => {
  const auth = isAuth()
  const [loading, setLoading] = useState(false)
  const [stages, setStages] = useState<StageInfo | undefined>(undefined)
  const [refetch, setRefetch] = useState(false)

  // onMount
  useEffect(() => {
    setLoading(true)
    fetch_api(
      alert,
      'tournament/stage/get',
      {
        tournament_id,
      },
      setStages,
    ).finally(() => setLoading(false))
  }, [refetch])

  const onNextRound = () => {
    setLoading(true)
    fetch_api(alert, 'tournament/stage/next', { tournament_id }, _ =>
      setRefetch(!refetch),
    ).finally(() => setLoading(false))
  }

  return loading ? (
    <Loader loading={loading} />
  ) : (
    <Paper elevation={5}>
      <FormGroup
        sx={{
          padding: '10px',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Typography sx={{ padding: '10px' }}>Etapy</Typography>
        {auth && (
          <Button
            onClick={_ => {
              onNextRound()
            }}
            variant="contained">
            Kolejna runda
          </Button>
        )}
      </FormGroup>
      <List sx={{ maxHeight: '70vh', overflowY: 'scroll' }}>
        <RoundDescriptor
          round={stages?.qualifier}
          name="Runda Kwalifikacyjna"
        />
        <RoundDescriptor round={stages?.first} name="Runda Pierwsza" />
        <RoundDescriptor round={stages?.second} name="Runda Druga" />
      </List>
    </Paper>
  )
}
