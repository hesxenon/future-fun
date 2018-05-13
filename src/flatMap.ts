import { CallFn, Call, Operator, ResolveOf } from './types'
import { createOperator } from './util'
import { execCall } from '..'

export function flatMap<Resolve extends Call = any, In = any> (mapFn: CallFn<In, Resolve>, thisArg?: any): Operator<ResolveOf<Resolve>, In, Resolve> {
  return createOperator(mapFn, thisArg, (previous) => {
    const mapped = mapFn.call(thisArg, previous) as Resolve
    return {
      out: mapped,
      resolve: execCall(mapped)
    }
  })
}
