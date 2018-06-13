import { IOperator, NullaryFunction, OutOf, ICallMonad, UnaryFunction } from '../types'
import { createOperator } from './util'

export function flatMapTo<From, To> (call: ICallMonad<To, From>): IOperator<From, To, UnaryFunction<From, To>> {
  return createOperator(call, call)
}
