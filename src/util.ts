import { CallFn, Operator, Call, Finish } from './types'
import { pipe } from './call'

export function createOperator<In, Out> (fn: CallFn<In, Out>, thisArg: any, exec: (prevRes: In, cb: Finish<Out>) => void): Operator<In, Out> {
  return (previous: Call<In>) => ({ fn, previous, pipe, then: (cb) => previous.then(prevRes => exec(prevRes, cb)), thisArg })
}
