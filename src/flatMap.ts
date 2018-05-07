import { CallFn, Call, Operator, ResolveOf } from './types'
import { createOperator } from './util'

export function flatMap<In = any, Out extends Call = any> (mapFn: CallFn<In, Out>, thisArg?: any): Operator<ResolveOf<Out>, In, Out> {
  return createOperator(mapFn, thisArg, (previous, finish) => {
    (mapFn.call(thisArg, previous) as ReturnType<typeof mapFn>).exec(finish)
  })
}
