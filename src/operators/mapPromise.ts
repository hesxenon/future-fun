import { IPipedCallMonad, InOf, M, UnaryFunction } from '../types'
import { createOperator, IOperator } from './util'

export function mapPromise<From, To> (morphism: UnaryFunction<From, To>): IOperator<Promise<From>, Promise<To>, From, To> {
  return createOperator(morphism, result => result.then(morphism))
}
