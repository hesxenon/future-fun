import { Call } from '../..'
import { ICallMonad, IBinaryOperator, M, UnaryFunction, OutOf, IExecutable } from '../types'
import { ident } from '../../test/test.util'

export const flatMap: <From, To extends M>(morphism: UnaryFunction<From, To>) => IBinaryOperator<From, IExecutable<To>> = (morphism) => (previous) => morphism(previous).with(previous)
