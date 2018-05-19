import { IOperator, M, OutOf, UnaryFunction } from '../types'
import { createOperator } from './util'

export const flatMap: <From, To extends M>(morphism: UnaryFunction<From, To>) => IOperator<From, OutOf<To>, typeof morphism> =
  createOperator(morphism => previous => morphism(previous).with(previous).exec())
