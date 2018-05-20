import { IPipe, IPipedOperator, M, Operator, IChainedOperator } from '../types'

export const pipe: IPipe = (...operators: Operator[]) => {
  const chain: IChainedOperator<any, any>[] = operators.map((operator, i, array) => {
    if (i === 0) {
      return operator as IChainedOperator<any, any>
    }
    return Object.assign(operator, { previous: array[i - 1] })
  })
  const morphism = (seed: any) => chain.reduce((y, { morphism: f }) => f(y), seed)

  return Object.assign(
    <Instance extends M>(instance: Instance) => chain.reduce((instance, operator) => operator(instance), instance as M),
    { morphism, last: chain[chain.length - 1] }
  ) as IPipedOperator<any, any>
}
