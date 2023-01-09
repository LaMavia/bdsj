import { Alert, AlertColor, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material"
import { MouseEventHandler, useState } from "react"
import { DeleteApiResponse, TournamentInfo } from "../../api"
import { API_URL } from "../../config"

export interface DeletePopupParams {
  show: boolean
  onSuccess: () => void
  onError: () => void
  tournament: TournamentInfo | null
  handleClose: () => void
}

export const DeletePopup = ({
  show,
  handleClose,
  onSuccess,
  onError,
  tournament,
}: DeletePopupParams) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')

  if (tournament == null) {
    return <></>
  }

  const onSubmit: MouseEventHandler = e => {
    e.stopPropagation()
    e.preventDefault()

    setIsLoading(true)
    const uri = `${API_URL}?path=tournament/delete`
    fetch(uri, {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify(
        {
          id: tournament.tournament_id,
        },
        null,
        0,
      ),
    })
      .then(res => res.json())
      .then((res: DeleteApiResponse) => {
        if (res.ok) {
          setAlertSeverity('success')
          setAlertMsg('poprawnie usunięto turniej')
          handleClose()
          onSuccess()
        } else {
          setAlertSeverity('error')
          setAlertMsg(res.error || '')
          onError()
        }
      })
      .catch((e: TypeError) => {
        debugger
        console.log(uri)
        setAlertMsg(e.message)
        setAlertSeverity('error')
      })
      .finally(() => {
        setShowAlert(true)
        setIsLoading(false)
      })
  }

  const closeAlert = () => {
    setShowAlert(false)
  }

  return (
    <>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Potwierdź operację</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć turniej {tournament.tournament_name}{' '}
            {tournament.tournament_year} ({tournament.tournament_id})?
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
      </Dialog>
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={closeAlert}>
        <Alert
          onClose={closeAlert}
          severity={alertSeverity}
          sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  )
}
