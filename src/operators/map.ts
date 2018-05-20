import { IOperator, UnaryFunction } from '../types'
import { createOperator } from './util'

export function map<From, To> (morphism: UnaryFunction<From, To>): IOperator<From, To, UnaryFunction<From, To>> {
  return createOperator(morphism, morphism)
}
