export type ListViewParams<T> = {
  schema: (keyof T)[],
  data: T[]
};