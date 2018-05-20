import { IPipe, IPipedOperator, M, Operator } from '../types'

export const pipe: IPipe = (...operators: Operator[]) => {
  const chain: IPipedOperator<any, any>[] = operators.map((val, i, array) => {
    if (i === 0) {
      return val as IPipedOperator<any, typeof val>
    }
    return Object.assign(val, { previous: array[i - 1] })
  })

  return (<Instance extends M>(instance: Instance) => chain.reduce((instance, operator) => operator(instance), instance as M)) as IPipedOperator<any, any>
}
