import { InOf, M, OutOf } from '../types'
import { INullaryOperator, createOperator } from './util'

export function flatMapTo<To extends M> (call: To): INullaryOperator<InOf<To>, OutOf<To>, To> {
  return createOperator(() => call, result => call.with(result).exec())
}
