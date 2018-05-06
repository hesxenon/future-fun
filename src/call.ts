import { CallFn, Call, Operator } from './types'

export function call<Resolve, In> (fn: CallFn<In, Resolve>, arg?: In, thisArg?: any): Call<Resolve, In, Resolve, undefined> {
  const exec = (arg?: In) => fn.call(thisArg, arg)
  return {
    fn, arg, previous: undefined, thisArg,
    test: (arg, cb) => cb(exec(arg)),
    exec: (cb) => cb(exec(arg)),
    pipe
  }
}

export function pipe<In, Resolve, Out, PIn, POut, PP> (this: Call<In, PIn, POut, PP>, next: Operator<Resolve, In, Out>): Call<Resolve, In, Out, typeof this> {
  const c = Object.assign(next<any>(this), { previous: this, pipe })
  return c
}
