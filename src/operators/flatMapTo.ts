import { InOf, M, OutOf, INullaryOperator } from '../types'
import { createOperator } from './util'

export function flatMapTo<To extends M> (call: To): INullaryOperator<InOf<To>, OutOf<To>, To> {
  return createOperator(() => call, result => call.with(result).exec())
}
