import { CallFn, Call, Operator } from './types'
import { pipe } from './util'

export function call<Resolve, In> (fn: CallFn<In, Resolve>, arg: In, thisArg?: any): Call<Resolve, In, Resolve, undefined> {
  return {
    fn, arg, previous: undefined, thisArg,
    exec: (previous: In, cb) => cb(fn.call(thisArg, previous)),
    pipe
  }
}
