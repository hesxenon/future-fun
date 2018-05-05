import { CallFn, Operator, Call, Finish } from './types'
import { pipe } from './call'

export function createOperator<In, Out> (fn: CallFn<In>, thisArg: any, exec: (previous: In | undefined, finish: Finish<Out>) => void): Operator<In, Out> {
  return (previous) => ({
    fn, previous, pipe, thisArg,
    then: cb => previous.then(prevRes => exec(prevRes, cb)),
    exec: (arg, finish) => exec(arg, finish)
  })
}
