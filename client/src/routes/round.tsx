import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { RoundEntry } from '../api'
import { ListView } from '../components/ListView'
import { Loader } from '../components/Loader'
import { zip } from '../helpers/lists'
import { fetch_api } from '../helpers/promises'
import { isAuth } from '../state/global'
import { useAlert } from '../state/hooks'

const deserialize_num = (x: string): number => (x === '' ? NaN : +x)

export const RoundRoute = () => {
  const match = useMatch('/round/:id')
  if (!match) {
    throw new Error("shouldn't happen")
  }

  // control
  const round_id = +(match.params.id || '0')
  const auth = isAuth()
  const [loading, setLoading] = useState(true)
  const [refetch, setRefetch] = useState(false)
  const alert = useAlert()
  const [entries, setEntries] = useState<RoundEntry[]>([])

  // onMount
  useEffect(() => {
    setLoading(true)
    fetch_api(
      alert,
      'round/get',
      {
        round_id,
      },
      setEntries,
    ).finally(() => setLoading(false))
  }, [refetch])

  const onCommit = (changedRows: RoundEntry[]): Promise<void> => {
    setLoading(true)

    function is_null<T>(x: T | undefined | null) {
      return (
        x === undefined ||
        x === null ||
        Number.isNaN(x) ||
        (typeof x === 'string' && x.length === 0)
      )
    }
    const [changed_jumps, deleted_jumps, inserted_jumps] = zip(
      entries,
      changedRows,
    ).reduce(
      ([c, d, i], [old_row, new_row]) => {
        if (is_null(new_row.jump_distance) && is_null(new_row.jump_score)) {
          d.push({
            round_id: round_id,
            participant_id: new_row.participant_id,
          })
        } else if (
          is_null(old_row.jump_score) &&
          is_null(old_row.jump_distance) &&
          !is_null(new_row.jump_score) &&
          !is_null(new_row.jump_distance)
        ) {
          i.push({
            jump_round_id: round_id,
            jump_participant_id: new_row.participant_id,
            jump_distance: new_row.jump_distance || -1,
            jump_score: new_row.jump_score || -1,
          })
        } else {
          c.push({
            jump_round_id: round_id,
            jump_participant_id: new_row.participant_id,
            jump_distance: new_row.jump_distance || -1,
            jump_score: new_row.jump_score || -1,
          })
        }

        return [c, d, i]
      },
      [
        [] as {
          jump_round_id: number
          jump_participant_id: number
          jump_score: number
          jump_distance: number
        }[],
        [] as { round_id: number; participant_id: number }[],
        [] as {
          jump_round_id: number
          jump_participant_id: number
          jump_score: number
          jump_distance: number
        }[],
      ],
    )

    const {
      c: changed_disqualifications,
      d: deleted_disqualifications,
      i: inserted_disqualifications,
    } = zip(entries, changedRows).reduce(
      (u, [old_row, new_row]) => {
        if (is_null(new_row.disqualification_reason)) {
          u.d.push({
            round_id: round_id,
            participant_id: new_row.participant_id,
          })
        } else if (
          is_null(old_row.disqualification_reason) &&
          !is_null(new_row.disqualification_reason)
        ) {
          u.i.push({
            disqualification_round_id: round_id,
            disqualification_participant_id: new_row.participant_id,
            disqualification_reason: new_row.disqualification_reason,
          })
        } else {
          u.c.push({
            disqualification_round_id: round_id,
            disqualification_participant_id: new_row.participant_id,
            disqualification_reason: new_row.disqualification_reason,
          })
        }

        return u
      },
      { c: [], d: [], i: [] } as {
        c: {
          disqualification_round_id: number
          disqualification_participant_id: number
          disqualification_reason: String
        }[]
        d: {
          round_id: number
          participant_id: number
        }[]
        i: {
          disqualification_round_id: number
          disqualification_participant_id: number
          disqualification_reason: String
        }[]
      },
    )

    return fetch_api(
      alert,
      'round/update_entries',
      {
        changed_jumps,
        deleted_jumps,
        inserted_jumps,
        changed_disqualifications,
        deleted_disqualifications,
        inserted_disqualifications,
      },
      () => {},
    ).finally(() => {
      setLoading(false)
      setRefetch(!refetch)
    })
  }

  return (
    <>
      {loading ? (
        <Loader loading={loading} />
      ) : (
        <ListView
          schema={[
            {
              key: 'position_final',
              align: 'left',
              display: 'Poz. kń.',
              default: '?',
            },
            { key: 'position_initial', align: 'left', display: 'Poz. st.' },
            { key: 'person_first_name', align: 'left', display: 'Imię' },
            { key: 'person_last_name', align: 'left', display: 'Nazwisko' },
            {
              key: 'participant_country_code',
              align: 'right',
              display: 'Kraj',
            },
            {
              key: 'jump_distance',
              align: 'right',
              display: 'Długość',
              default: 'DSQ',
              alt: 'disqualification_reason',
              deserialize: deserialize_num,
            },
            {
              key: 'disqualification_reason',
              align: 'right',
              display: 'Powód',
              onlyEdit: true,
              deserialize: x => x,
            },
            {
              key: 'jump_score',
              align: 'right',
              display: 'Ocena',
              default: '0',
              deserialize: deserialize_num,
            },
            {
              key: 'score',
              align: 'right',
              display: 'Punkty',
              default: '0',
              deserialize: deserialize_num,
            },
          ]}
          data={entries}
          key_func={e => `${e.participant_id}`}
          onDelete={_ => {}}
          onCommit={onCommit}>
          <Typography variant="h4">Wyniki rundy</Typography>
        </ListView>
      )}
      <alert.AlertComponent />
    </>
  )
}
