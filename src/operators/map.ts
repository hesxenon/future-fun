import { IOperator, UnaryFunction } from '../types'
import { createOperator } from './util'

export const map: <From, To>(morphism: UnaryFunction<From, To>) => IOperator<From, To, typeof morphism> =
  createOperator((morphism) => (previous) => morphism(previous))
