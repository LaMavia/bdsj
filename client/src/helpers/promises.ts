import { ApiResponse } from '../api'
import { API_URL } from '../config'
import { AlertState } from '../state/hooks'

export const fetch_api = <T = unknown, O extends Object = Object>(
  alert: AlertState,
  path: string,
  body: O | undefined,
  f: (data: T) => void,
): Promise<void> =>
  fetch(`${API_URL}?path=${path}`, {
    method: 'POST',
    credentials: 'include',
    ...(body ? { body: JSON.stringify(body, null, 0) } : {}),
  })
    .then(r => {
      if (!r.ok || r.status !== 200) {
        const msg = `${r.url} => ${r.statusText}(${r.status})`
        return r
          .json()
          .then((b: ApiResponse<null>) => b.error || msg)
          .catch(_ => msg)
          .then(b => {
            throw new Error(b)
          })
      }

      return r.json() as Promise<ApiResponse<T>>
    })
    .then(r => {
      if (!r.ok) {
        throw new TypeError(r.error)
      }

      f(r.data)
    })
    .catch((e: TypeError) => alert.display(e.message, 'error'))
