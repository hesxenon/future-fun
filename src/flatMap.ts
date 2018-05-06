import { CallFn, Call, Operator } from './types'
import { createOperator } from './util'

export function flatMap<In, Resolve, Out, Previous, CIn> (fn: CallFn<In, Call<Resolve, CIn, Out, Previous>>, thisArg?: any): Operator<In, Resolve, Call<Resolve, CIn, Out, Previous>> {
  return createOperator(fn, thisArg, (previous, finish) => {
    (fn.call(thisArg, previous) as ReturnType<typeof fn>).exec(finish)
  })
}
