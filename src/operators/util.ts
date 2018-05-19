import { Call } from '../..'
import { INullaryOperator, IPipedCallMonad, IUnaryOperator, M, NullaryFunction, OutOf, UnaryFunction } from '../types'

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
