import { IPipedCallMonad, InOf, M, UnaryFunction } from '../types'
import { transformCall, IBindCall } from './util'

export function mapPromise<From, To> (morphism: UnaryFunction<From, To>): IBindCall<Promise<From>, Promise<To>, From, To> {
  return instance => transformCall({ morphism, on: instance }, result => result.then(morphism))
}

export type ResolveOf<P> = P extends Promise<infer Resolve> ? Resolve : any
