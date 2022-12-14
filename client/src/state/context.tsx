import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useReducer,
} from 'react'

export function dynamic_state<A>(val: A) {
  return useReducer(
    (old: Partial<A>, arg: Partial<A>) => ({ ...old, ...arg }),
    val,
  )
}

export function make_ctx<A>(val: Partial<A>) {
  type UpdateType = Dispatch<Partial<A>>
  const dispatch: UpdateType = _ => {}
  const ctx = createContext({
    state: val,
    dispatch,
  })

  function Provider(props: PropsWithChildren<{}>) {
    const [state, dispatch] = useReducer(
      (old: Partial<A>, arg: Partial<A>) => ({ ...old, ...arg }),
      val,
    )
    return <ctx.Provider value={{ state, dispatch }} {...props} />
  }
  return [ctx, Provider] as [typeof ctx, typeof Provider]
}
