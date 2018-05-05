import { CallFn, Operator, Call, Finish } from './types'
import { pipe } from './call'

export function createOperator<In, Out, FnOut> (fn: CallFn<In, FnOut>, thisArg: any, exec: (previous: In, finish: Finish<Out>) => void): Operator<In, Out, FnOut> {
  return (previous) => ({ fn, previous, pipe, then: (cb) => previous.then(prevRes => exec(prevRes, cb)), thisArg })
}
