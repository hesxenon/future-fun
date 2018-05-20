import { IOperator, IPipe, M, Operator, IPipedOperator } from '../types'

export const pipe: IPipe = (...chained: Operator[]) => {
  const x: IPipedOperator<any, any>[] = chained.map((val, i, array) => {
    if (i === 0) {
      return val as IPipedOperator<any, typeof val>
    }
    return Object.assign(val, { previous: array[i - 1] })
  })

  return (<Instance extends M>(instance: Instance) => x.reduce((instance, operator) => operator(instance), instance as M)) as IPipedOperator<any, any>
}
