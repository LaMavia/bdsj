export const zip_with = <X, Y, Z>(
  xs: X[],
  ys: Y[],
  f: (x: X, y: Y, i?: number) => Z,
): Z[] =>
  new Array(Math.min(xs.length, ys.length))
    .fill(undefined)
    .map((_, i) => f(xs[i], ys[i]))

export const zip = <X, Y>(xs: X[], ys: Y[]): [X, Y][] =>
  new Array(Math.min(xs.length, ys.length))
    .fill(undefined)
    .map((_, i) => [xs[i], ys[i]])

export const bucket_inner_join = <T>(
  key_f: (x: T) => string | number,
  xs: T[],
  ys: T[],
): [T, T][] => {
  const lookup = ys.reduce(
    (u, y) => ({ [key_f(y)]: y, ...u }),
    {} as Record<string | number, T>,
  )

  return xs.reduce(
    (u, x) => (key_f(x) in lookup ? [[x, lookup[key_f(x)]], ...u] : u),
    [] as [T, T][],
  )
}
