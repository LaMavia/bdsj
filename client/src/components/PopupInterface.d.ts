export interface PopupProps {
  show: boolean
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
  handleClose: () => void
}
