import { UnaryFunction, IOperator } from '../types'

export const mapPromise: <In, Out>(morphism: UnaryFunction<In, Out>) => IOperator<Promise<In>, Promise<Out>> = (morphism) => {
  return (previous) => {
    return previous.map(x$ => x$.then(morphism))
  }
}
