import { map } from './map'
import { UnaryFunction, ICallMonad, IOperator } from '../types'
import { createOperator } from './util'

export function flatMap<From, To> (morphism: UnaryFunction<From, ICallMonad<To, From>>): IOperator<From, To, typeof morphism> {
  return createOperator(morphism, result => morphism(result)(result))
}
