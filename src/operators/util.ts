import { Call } from '../..'
import { IPipedCallMonad, InOf, M, OutOf, UnaryFunction, ICallMonad } from '../types'

export function transformCall<In, Out, From, To, Instance extends M> ({ morphism, on }: { morphism: UnaryFunction<From, To>, on: Instance }, fn: (result: OutOf<Instance>) => Out) {
  return Object.assign(
    Call.of((result: OutOf<Instance>) => {
      return fn(on.with(result).exec())
    }),
    { previous: on, morphism }
  ) as IPipedCallMonad<In, Out, UnaryFunction<From, To>, Instance>
}

export interface IBindCall<In, Out, From, To> {
  <Instance extends ICallMonad<InOf<Instance>, In>>(instance: Instance): IPipedCallMonad<InOf<Instance>, Out, UnaryFunction<From, To>, Instance>
}
