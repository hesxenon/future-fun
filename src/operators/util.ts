import { Call } from '../..'
import { ICallMonad, IOperator, Morphism, NullaryFunction, UnaryFunction } from '../types'

export function createOperator<In, Out, To> (morphism: NullaryFunction<To>, transform: (result: In) => Out): IOperator<In, Out, typeof morphism>
export function createOperator<In, Out, From, To> (morphism: UnaryFunction<From, To>, transform: (result: In) => Out): IOperator<In, Out, typeof morphism>
export function createOperator<In, Out> (morphism: Morphism, transform: (result: In) => Out): IOperator<In, Out, typeof morphism> {
  const op: IOperator<In, Out, typeof morphism> = Object.assign(
    <Instance extends ICallMonad<In, any>> (instance: Instance) => Call.of((result: any) => transform(instance(result))),
    { morphism }
  )
  return op
}
