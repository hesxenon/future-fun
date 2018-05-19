import { UnaryFunction, M, IPipedCallMonad, ICallMonad, InOf } from '../types'
import { createCallFactory } from './util'

export const map: <From, To, Instance extends M>(instance: Instance, morphism: UnaryFunction<From, To>) => IPipedCallMonad<InOf<Instance>, To, UnaryFunction<From, To>, Instance> =
  createCallFactory(({ morphism }) => result => {
    return morphism(result)
  })
