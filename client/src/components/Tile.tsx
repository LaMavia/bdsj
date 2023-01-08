import styled from '@emotion/styled'
import { Button, Paper } from '@mui/material'
import { ComponentProps } from 'react'

function RawItem(props: ComponentProps<typeof Paper>) {
  const StyledButton = styled(Button)(({ theme }) => ({
    height: '100%',
    width: '100%',
    padding: '0 20px',
  }))
  return (
    <Paper {...props}>
      <StyledButton>{props.children}</StyledButton>
    </Paper>
  )
}

export const Tile = styled(RawItem)(({ theme }) => ({
  //@ts-ignore
  ...theme.typography.body2,
  textAlign: 'center',
  //@ts-ignore
  color: theme.palette.text.secondary,
  //@ts-ignore
  background: theme.palette.background.default,
  height: 100,
  lineHeight: '100px',
}))
