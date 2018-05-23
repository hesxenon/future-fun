import { IChainedOperator, IPipe, IPipedOperator, M, Operator } from '../types'
import { createOperator } from './util'

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

  const finalMorphism = (seed: any) => chain.reduce((y, { morphism: f }) => f(y), seed)
  const finalOperator: IPipedOperator<any, any> = Object.assign(createOperator(finalMorphism, finalMorphism), { last: chain[chain.length - 1] })

  return Object.assign(
    function <Instance extends M>(instance: Instance) {
      const finalCall = chain.reduce((instance, operator) => operator(instance), instance as M)
      return Object.assign(finalCall, { previous: instance, operator: finalOperator })
    },
    { morphism: finalMorphism, last: chain[chain.length - 1] }
  )
}
