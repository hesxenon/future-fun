import { ICallMonad, IOperator, UnaryFunction } from '../types'
import { createOperator } from './util'

export function flatMap<From, To> (morphism: UnaryFunction<From, ICallMonad<To, any, From>>): IOperator<From, To, typeof morphism> {
  return createOperator(morphism, result => morphism(result)(result))
}
