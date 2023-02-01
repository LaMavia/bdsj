import {
  Alert,
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from '@mui/material'
import { MouseEventHandler, useState } from 'react'
import { DeleteApiResponse, PersonInfo, TournamentInfo } from '../../api'
import { API_URL } from '../../config'
import { fetch_api } from '../../helpers/promises'
import { useAlert } from '../../state/hooks'

export interface DeletePopupParams {
  show: boolean
  onSuccess: () => void
  onError: () => void
  person: PersonInfo | null
  handleClose: () => void
}

export const DeletePopup = ({
  show,
  handleClose,
  onSuccess,
  person,
}: DeletePopupParams) => {
  const [isLoading, setIsLoading] = useState(false)
  const alert = useAlert()

  if (person === null) {
    return <></>
  }

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    fetch_api(alert, 'person/delete', { id: person.person_id }, r => {
      alert.display('poprawnie usunięto osobę', 'success')
      handleClose()
      onSuccess()
    }).finally(() => setIsLoading(false))
  }

  return (
    <>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Potwierdź operację</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć zawodnika {person.person_first_name}
            {' '}
            {person.person_last_name} ({person.person_gender}{', '}
            {person.person_nationality_code})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={handleClose}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isLoading} onClick={onSubmit}>
            Potwierdź
          </Button>
        </DialogActions>
        <alert.AlertComponent />
      </Dialog>
    </>
  )
}
