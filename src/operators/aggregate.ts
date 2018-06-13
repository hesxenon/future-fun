import { ICallMonad, IOperator, IAggregate } from '../types'

/**
 * aggregate creates a new operator from the passed in operators that simply combines the morphisms
 */
export const aggregate: IAggregate = (...operators: IOperator<any, any, any>[]) => {
  return Object.assign(
    function (instance: ICallMonad<any, any>) {
      return operators.reduce((instance, operator) => operator(instance), instance)
    },
    { morphism: (seed: any) => operators.reduce((x, { morphism: f }) => f(x), seed) }
  )
}
