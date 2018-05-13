import { CallFn, Operator, Call } from './types'

export function createOperator<Resolve, In, Out> (fn: CallFn<In, Out>, thisArg: any, exec: Call['exec']): Operator<Resolve, In, Out> {
  return (previous) => ({
    fn, previous, pipe, thisArg,
    exec
  })
}

export function pipe<In, Resolve, Out, PIn, POut, PP> (this: Call<In, PIn, POut, PP>, next: Operator<Resolve, In, Out>): Call<Resolve, In, Out, typeof this> {
  const c = Object.assign(next(this), { previous: this, pipe })
  return c
}
