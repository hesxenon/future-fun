import { UnaryFunction, IBinaryOperator } from '../..'

export const map: <From, To>(morphism: UnaryFunction<From, To>) => IBinaryOperator<From, To> = (morphism) => (previous) => morphism(previous)
