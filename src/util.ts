import { CallFn, Operator, Call, ExecCallback } from './types'
import { pipe } from './call'

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
