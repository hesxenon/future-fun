import { CallFn, Call, Operator, ResolveOf } from './types'
import { createOperator } from './util'
import { execCall } from '..'

export function flatMap<Resolve extends Call = any, In = any> (mapFn: CallFn<In, Resolve>, thisArg?: any): Operator<ResolveOf<Resolve>, In, Resolve> {
  return createOperator(mapFn, thisArg, (previous, finish) => {
    execCall((mapFn.call(thisArg, previous) as ReturnType<typeof mapFn>), finish)
  })
}
