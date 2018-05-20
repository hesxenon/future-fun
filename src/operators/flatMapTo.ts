import { IOperator, M, NullaryFunction, OutOf } from '../types'
import { createOperator } from './util'

export function flatMapTo<In, To extends M> (call: To): IOperator<any, OutOf<To>, NullaryFunction<To>> {
  return createOperator(() => call, result => call.with(result))
}
