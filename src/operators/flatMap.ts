import { ICallMonad, IPipedCallMonad, InOf, OutOf, UnaryFunction } from '../types'
import { transformCall, IBindCall } from './util'

export function flatMap<From, To extends ICallMonad<From, any>> (morphism: UnaryFunction<From, To>): IBindCall<From, OutOf<To>, From, To> {
  return transformCall(morphism, result => morphism(result).with(result).exec())
}
