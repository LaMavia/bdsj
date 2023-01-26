import { Alert, AlertColor, Snackbar } from '@mui/material'
import { ReactElement, useState } from 'react'

interface AlertState {
  display: (msg: string, severity: AlertColor) => void
  hide: () => void
  AlertComponent: () => JSX.Element
}

export const useAlert = (): AlertState => {
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')

  const hide = () => {
    setShowAlert(false)
  }
  const AlertComponent = () => (
    <Snackbar open={showAlert} autoHideDuration={6000} onClose={hide}>
      <Alert onClose={hide} severity={alertSeverity} sx={{ width: '100%' }}>
        {alertMsg}
      </Alert>
    </Snackbar>
  )

  return {
    display: (msg, severity) => {
      setAlertMsg(msg)
      setAlertSeverity(severity)
      setShowAlert(true)
    },
    hide,
    AlertComponent,
  }
}

export const useCounter = (v: number) => {
  const [val, setVal] = useState(v)
  return [val, () => setVal(val - 1), () => setVal(val + 1)] as [
    number,
    () => void,
    () => void,
  ]
}
