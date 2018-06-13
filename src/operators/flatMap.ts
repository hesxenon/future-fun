import { ICallMonad, IOperator, OutOf, UnaryFunction } from '../types'
import { createOperator } from './util'

export function flatMap<From, To> (morphism: UnaryFunction<From, ICallMonad<To, From>>): IOperator<From, To, UnaryFunction<From, ICallMonad<To, From>>> {
  return createOperator(morphism, result => morphism(result)(result))
}
