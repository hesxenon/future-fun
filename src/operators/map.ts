import { InOf, M, OutOf, UnaryFunction } from '../types'
import { IOperator, createOperator } from './util'

export function map<From, To> (morphism: UnaryFunction<From, To>): IOperator<From, To, From, To> {
  return createOperator(morphism, morphism)
}
