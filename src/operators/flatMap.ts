import { ICallMonad, IOperator, OutOf, UnaryFunction } from '../types'
import { createOperator } from './util'

export function flatMap<From, To extends ICallMonad<From, any>> (morphism: UnaryFunction<From, To>): IOperator<From, OutOf<To>, UnaryFunction<From, To>> {
  return createOperator(morphism, result => morphism(result).with(result))
}
