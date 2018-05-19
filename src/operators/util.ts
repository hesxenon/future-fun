import { M, UnaryFunction, InOf, IOperator, IPipedCallMonad } from '../types'

export function createOperator<In, Out, From, To> (fn: (morphism: UnaryFunction<From, To>) => UnaryFunction<In, Out>) {
  return (morphism: InOf<typeof fn>) => Object.assign(
    fn(morphism),
    { morphism }
  ) as IOperator<In, Out, typeof morphism>
}

export function pipe<Instance extends M> (start: Instance, ...ops: IOperator<any, any, any>[]) {
  return start.map(x => ops.reduce((y, val) => val(y), x))
}
