import { IOperator, UnaryFunction } from '../types'
import { createOperator } from './util'

export const mapPromise: <In, Out>(morphism: UnaryFunction<In, Out>) => IOperator<Promise<In>, Promise<Out>, typeof morphism> =
  createOperator(morphism => result => result.then(morphism))
