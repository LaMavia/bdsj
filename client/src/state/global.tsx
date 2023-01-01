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
    const session_tuple = document.cookie
      .split(';')
      .map(def => def.split('=') as [string, string])
      .filter(([key, _]) => key == 'session_key')
    
    console.dir(session_tuple)

    const [ctx, new_provider] = make_ctx<GlobalState>(
      session_tuple.length == 1 ? { session_key: session_tuple[0][1] } : {},
    )

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
