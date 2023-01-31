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
import {
  DeleteApiResponse,
  LocationInfo,
  PersonInfo,
  TournamentInfo,
} from '../../api'
import { API_URL } from '../../config'
import { fetch_api } from '../../helpers/promises'
import { useAlert } from '../../state/hooks'

export interface DeletePopupParams {
  show: boolean
  onSuccess: () => void
  onError: () => void
  location: LocationInfo | null
  handleClose: () => void
}

export const DeletePopup = ({
  show,
  handleClose,
  onSuccess,
  location,
}: DeletePopupParams) => {
  const [isLoading, setIsLoading] = useState(false)
  const alert = useAlert()

  if (location === null) {
    return <></>
  }

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    fetch_api(alert, 'location/delete', { id: location.location_id }, r => {
      debugger
      alert.display('poprawnie usunięto lokalizację', 'success')
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
            Czy na pewno chcesz usunąć lokalizację {location.location_name} (
            {location.location_city} {', '} {location.location_country_name})
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
