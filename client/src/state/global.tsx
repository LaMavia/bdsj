import {
  Context,
  PropsWithChildren,
  Provider,
  ProviderExoticComponent,
  ProviderProps,
} from 'react'
import { make_ctx } from './context'

export interface GlobalState {
  session_key: string
}

let provider: (props: PropsWithChildren<{}>) => JSX.Element
let context: Context<{
  state: Partial<GlobalState>
  dispatch: React.Dispatch<Partial<GlobalState>>
}>

const init = () => {
  if (provider === undefined) {
    const [ctx, new_provider] = make_ctx<GlobalState>({})

    provider = new_provider
    context = ctx
  }
}

export const getGlobalProvider = () => {
  init()
  return provider
}

export const getGlobalContext = () => {
  init()
  return context
}

export const get_session_tuple = () =>
  document.cookie
    .split(';')
    .map(def => def.split('=').map(s => s.trim()) as [string, string])
    .filter(([key, _]) => key == 'session_key')

export const isAuth = () => {
  const session_tuple = get_session_tuple()
  return session_tuple && !!session_tuple[0]
}
