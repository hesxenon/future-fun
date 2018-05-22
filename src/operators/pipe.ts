import { IChainedOperator, IPipe, IPipedOperator, M, Operator } from '../types'

/**
 * pipe creates a new operator from the passed in operators that has the original instance as its previous instance
 *              |_________________pipe_________________|
 * -instance -- |      operator     ----- operator     |
 *              |         |        /         |         |
 *              |    next instance  <-  next instance  |
 */
export const pipe: IPipe = (...operators: Operator[]) => {
  const chain: IChainedOperator<any, any>[] = operators.map((operator, i, array) => {
    if (i === 0) {
      return operator as IChainedOperator<any, any>
    }
    return Object.assign(operator, { previous: array[i - 1] })
  })
  const morphism = (seed: any) => chain.reduce((y, { morphism: f }) => f(y), seed)

  return Object.assign(
    <Instance extends M>(instance: Instance) => {
      return Object.assign(chain.reduce((instance, operator) => operator(instance), instance as M), { previous: instance })
    },
    { morphism, last: chain[chain.length - 1] }
  ) as IPipedOperator<any, any>
}
