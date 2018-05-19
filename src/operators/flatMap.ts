import { ICallMonad, IPipedCallMonad, InOf, OutOf, UnaryFunction, IUnaryOperator } from '../types'
import { createOperator } from './util'

export function flatMap<From, To extends ICallMonad<From, any>> (morphism: UnaryFunction<From, To>): IUnaryOperator<From, OutOf<To>, From, To> {
  return createOperator(morphism, result => morphism(result).with(result).exec())
}
