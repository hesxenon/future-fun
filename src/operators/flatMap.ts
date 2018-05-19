import { M, OutOf, UnaryFunction, IPipedCallMonad, ICallMonad, InOf } from '../types'
import { createCallFactory } from './util'

export const flatMap: <From, To extends ICallMonad<From, any>, Instance extends ICallMonad<any, From>>(instance: Instance, morphism: UnaryFunction<From, To>) => IPipedCallMonad<InOf<Instance>, OutOf<To>, UnaryFunction<From, To>, Instance> =
  createCallFactory(({ morphism }) => result => {
    return morphism(result).with(result).exec()
  })
