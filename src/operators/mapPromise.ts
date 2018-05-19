import { IPipedCallMonad, InOf, M, UnaryFunction } from '../types'
import { createCallFactory } from './util'

export const mapPromise: <In, Out, Instance extends M>(instance: Instance, morphism: UnaryFunction<In, Out>) => IPipedCallMonad<InOf<Instance>, Out, UnaryFunction<In, Out>, Instance> =
  createCallFactory(({ morphism }) => result => result.then(morphism))
