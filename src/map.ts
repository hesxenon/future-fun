import { Operator, CallFn } from './types'
import { createOperator } from './util'

export function map<Resolve, In> (fn: CallFn<In, Resolve>, thisArg?: any): Operator<Resolve, In, Resolve> {
  return createOperator(fn, thisArg, (previous) => fn.call(thisArg, previous))
}
