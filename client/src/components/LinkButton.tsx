import { ButtonPropsColorOverrides, Button } from '@mui/material'
import { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

export interface LinkButtonProps {
  to: string
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
  disabled?: boolean
  variant?: 'text' | 'outlined' | 'contained'
}

export const LinkButton = ({
  color,
  disabled,
  variant,
  to,
  children,
}: PropsWithChildren<LinkButtonProps>) => (
  <Button {...{ color, disabled, variant }}>
    <Link to={to} style={{ color: 'inherit', textDecoration: 'inherit' }}>
      {children}
    </Link>
  </Button>
)
