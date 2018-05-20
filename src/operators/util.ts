import { Call } from '../..'
import { IOperator, IPipedCallMonad, M, NullaryFunction, OutOf, UnaryFunction, InOf, ICallMonad, Morphism } from '../types'

export function createOperator<In, Out, To> (morphism: NullaryFunction<To>, fn: (result: In) => Out): IOperator<In, Out, typeof morphism>
export function createOperator<In, Out, From, To> (morphism: UnaryFunction<From, To>, fn: (result: In) => Out): IOperator<In, Out, typeof morphism>
export function createOperator<In, Out, From, To> (morphism: Morphism, fn: (result: In) => Out) {
  const op: IOperator<In, Out, typeof morphism> = Object.assign(<Instance extends ICallMonad<any, In>>(instance: Instance) => Object.assign(
    Call.of((result) => {
      return fn(instance.with(result).exec())
    }),
    { previous: instance, operator: op }
  ), { morphism })
  return op
}
