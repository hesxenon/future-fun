import { IPipedCallMonad, InOf, M, UnaryFunction } from '../types'
import { createOperator, IUnaryOperator } from './util'

export function mapPromise<From, To> (morphism: UnaryFunction<From, To>): IUnaryOperator<Promise<From>, Promise<To>, From, To> {
  return createOperator(morphism, result => result.then(morphism))
}
