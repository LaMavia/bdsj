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
import { CountryDescInfo } from '../../api'
import { fetch_api } from '../../helpers/promises'
import { useAlert } from '../../state/hooks'

export interface DeletePopupParams {
  show: boolean
  onSuccess: () => void
  onError: () => void
  country: CountryDescInfo | null
  handleClose: () => void
}

export const DeletePopup = ({
  show,
  handleClose,
  onSuccess,
  country,
}: DeletePopupParams) => {
  const [isLoading, setIsLoading] = useState(false)
  const alert = useAlert()

  if (country === null) {
    return <></>
  }

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    fetch_api(alert, 'country/delete', { code: country.country_code }, _ => {
      alert.display('poprawnie usunięto kraj', 'success')
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
            Czy na pewno chcesz usunąć kraj {country.country_name}(
            {country.country_code})?
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
