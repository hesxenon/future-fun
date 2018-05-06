import { CallFn, Call, Operator } from './types'
import { createOperator } from './util'

export function flatMap<In, Resolve, Out, Previous, PIn> (fn: CallFn<In, Call<Resolve, PIn, Out, Previous>>, thisArg?: any): Operator<In, Resolve, Call<Resolve, In, Out, Previous>> {
  return createOperator(fn as any, thisArg, (previous, finish) => {
    const call = fn.call(thisArg, previous)
    call.then(finish)
  })
}
