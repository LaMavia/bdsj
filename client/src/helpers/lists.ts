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
