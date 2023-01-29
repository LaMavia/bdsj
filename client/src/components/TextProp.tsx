import { ListItem, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'

export interface TextPropProps {
  label: string
  value: string
  link: string
}
export const TextProp = ({ label, value, link }: TextPropProps) => (
  <ListItem sx={{ display: 'block' }}>
    <ListItemText>{label}:</ListItemText>
    <ListItemText>
      <Link style={{ color: 'inherit' }} to={link}>
        {value}
      </Link>
    </ListItemText>
  </ListItem>
)
