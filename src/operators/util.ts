import { Call } from '../..'
import { IPipedCallMonad, InOf, M, OutOf, UnaryFunction, ICallMonad, NullaryFunction } from '../types'

export function createOperator<In, Out, To, Instance extends M> (morphism: NullaryFunction<To>, fn: (result: OutOf<Instance>) => Out): INullaryOperator<In, Out, To>
export function createOperator<In, Out, From, To, Instance extends M> (morphism: UnaryFunction<From, To>, fn: (result: OutOf<Instance>) => Out): IUnaryOperator<In, Out, From, To>
export function createOperator<In, Out, From, To, Instance extends M> (morphism: UnaryFunction<From, To>, fn: (result: OutOf<Instance>) => Out) {
  return (instance: Instance) => Object.assign(
    Call.of((result: OutOf<Instance>) => {
      return fn(instance.with(result).exec())
    }),
    { previous: instance, morphism }
  ) as IPipedCallMonad<In, Out, UnaryFunction<From, To>, Instance>
}

export interface INullaryOperator<In, Out, To> {
  <Instance extends ICallMonad<InOf<Instance>, In>>(instance: Instance): IPipedCallMonad<InOf<Instance>, Out, NullaryFunction<To>, Instance>
}

export interface IUnaryOperator<In, Out, From, To> {
  <Instance extends ICallMonad<InOf<Instance>, In>>(instance: Instance): IPipedCallMonad<InOf<Instance>, Out, UnaryFunction<From, To>, Instance>
}
