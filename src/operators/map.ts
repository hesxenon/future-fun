import { InOf, M, OutOf, UnaryFunction, IUnaryOperator } from '../types'
import { createOperator } from './util'

export function map<From, To> (morphism: UnaryFunction<From, To>): IUnaryOperator<From, To, From, To> {
  return createOperator(morphism, morphism)
}
