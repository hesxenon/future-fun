import { IPipedCallMonad, InOf, M, UnaryFunction } from '../types'
import { transformCall, IBindCall } from './util'

export function mapPromise<From, To> (morphism: UnaryFunction<From, To>): IBindCall<Promise<From>, Promise<To>, From, To> {
  return transformCall(morphism, result => result.then(morphism))
}
