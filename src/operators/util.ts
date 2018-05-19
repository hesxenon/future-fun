import { UnaryFunction, InOf, IOperator } from '../..'

export function createOperator<In, Out, From, To> (fn: (morphism: UnaryFunction<From, To>) => UnaryFunction<In, Out>) {
  return (morphism: InOf<typeof fn>) => Object.assign(
    fn(morphism),
    { morphism }
  ) as IOperator<In, Out, typeof morphism>
}
