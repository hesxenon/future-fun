import { CallFn, Call, Operator } from './types'
import { createOperator } from './util'

export function flatMap<In, Out> (fn: CallFn<In, Call<Out>>, thisArg?: any): Operator<In, Out> {
  return createOperator(fn as any, thisArg, (previous, finish) => {
    const call = fn.call(thisArg, previous)
    call.then(finish)
  })
}
