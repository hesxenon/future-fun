import { IOperator, UnaryFunction } from '../types'
import { createOperator } from './util'

export function mapPromise<From, To> (morphism: UnaryFunction<From, To>): IOperator<Promise<From>, Promise<To>, UnaryFunction<From, To>> {
  return createOperator(morphism, result => result.then(morphism))
}
