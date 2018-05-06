import { CallFn, Call, Operator } from './types'
import { pipe } from './util'

export function call<Resolve, In> (fn: CallFn<In, Resolve>, arg?: In, thisArg?: any): Call<Resolve, In, Resolve, undefined> {
  const exec = (arg?: In) => fn.call(thisArg, arg)
  return {
    fn, arg, previous: undefined, thisArg,
    test: (arg, cb) => cb(exec(arg)),
    exec: (cb) => cb(exec(arg)),
    pipe
  }
}
