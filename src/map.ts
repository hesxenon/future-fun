import { Operator, CallFn } from './types'
import { createOperator } from './util'

export function map<MappedCall, In> (fn: CallFn<In, MappedCall>, thisArg?: any): Operator<MappedCall, In, MappedCall> {
  return createOperator(fn, thisArg, (previous) => {
    const resolve = fn.call(thisArg, previous)
    return { out: resolve, resolve }
  })
}
