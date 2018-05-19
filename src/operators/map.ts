import { InOf, M, OutOf, UnaryFunction } from '../types'
import { IBindCall, transformCall } from './util'

export function map<From, To> (morphism: UnaryFunction<From, To>): IBindCall<From, To, From, To> {
  return (instance) => transformCall({ morphism, on: instance }, morphism)
}
