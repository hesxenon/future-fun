import { M, IOperator, OutOf, InOf } from '../types'
import { createOperator } from './util'

export const flatMapTo: <To extends M>(call: To) => IOperator<any, OutOf<To>, () => To> = (call) => Object.assign(
  (result: InOf<typeof call>) => call.with(result).exec(),
  { morphism: () => call }
)
