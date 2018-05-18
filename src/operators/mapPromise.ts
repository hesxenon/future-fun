import { IBinaryOperator, M, UnaryFunction, IMappedCallMonad, ICallMonad } from '../types'

export const mapPromise: <In, Out>(morphism: UnaryFunction<In, Out>) => IBinaryOperator<Promise<In>, Promise<Out>> = (morphism) => (result) => result.then(morphism)
