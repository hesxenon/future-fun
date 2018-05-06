import { CallFn, Call, Operator } from './types'

export function call<Out, In = any> (fn: CallFn<In, Out>, arg?: In, thisArg?: any): Call<Out, In, Out, undefined> {
  const exec = (arg?: In) => fn.call(thisArg, arg)
  return {
    fn, arg, previous: undefined, thisArg,
    exec: (arg, cb) => cb(exec(arg)),
    then: (cb) => cb(exec(arg)),
    pipe
  }
}

export function pipe<In, Out, FnOut, PIn, PFnOut, PP> (this: Call<In, PIn, PFnOut, PP>, next: Operator<In, Out, FnOut>): Call<Out, In, FnOut, typeof this> {
  const c = Object.assign(next<any>(this), { previous: this, pipe })
  return c
}
