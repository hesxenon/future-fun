import { CallFn, Operator, Call, Finish } from './types'
import { pipe } from './call'

export function createOperator<Resolve, In, Out> (fn: CallFn<In, Out>, thisArg: any, exec: (previous: In | undefined, finish: Finish<Resolve>) => void): Operator<In, Resolve, Out> {
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
