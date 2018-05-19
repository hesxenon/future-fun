import { Call } from '../..'
import { IPipedCallMonad, InOf, M, OutOf, UnaryFunction, ICallMonad } from '../types'

export function transformCall<In, Out, From, To, Instance extends M> (morphism: UnaryFunction<From, To>, fn: (result: OutOf<Instance>) => Out) {
  return (instance: Instance) => Object.assign(
    Call.of((result: OutOf<Instance>) => {
      return fn(instance.with(result).exec())
    }),
    { previous: instance, morphism }
  ) as IPipedCallMonad<In, Out, UnaryFunction<From, To>, Instance>
}

export interface IBindCall<In, Out, From, To> {
  <Instance extends ICallMonad<InOf<Instance>, In>>(instance: Instance): IPipedCallMonad<InOf<Instance>, Out, UnaryFunction<From, To>, Instance>
}
