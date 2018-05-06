import { CallFn, Operator, Call, ExecCallback } from './types'

export function createOperator<Resolve, In, Out> (fn: CallFn<In, Out>, thisArg: any, exec: (previous: In | undefined, finish: ExecCallback<Resolve>) => void): Operator<Resolve, In, Out> {
  return (previous) => ({
    fn, previous, pipe, thisArg,
    exec: cb => previous.exec(prevRes => exec(prevRes, cb)),
    test: (arg, finish) => {
      exec(arg, resolve => {
        const out = fn.call(thisArg, arg)
        finish({ resolve, out })
      })
    }
  })
}

export function pipe<In, Resolve, Out, PIn, POut, PP> (this: Call<In, PIn, POut, PP>, next: Operator<Resolve, In, Out>): Call<Resolve, In, Out, typeof this> {
  const c = Object.assign(next<any>(this), { previous: this, pipe })
  return c
}
