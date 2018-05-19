import { Call } from '../..'
import { IPipedCallMonad, InOf, M, OutOf, UnaryFunction } from '../types'

export function createCallFactory<In, Out, From, To, Instance extends M> (fn: (arg: { instance: Instance, morphism: UnaryFunction<From, To> }) => (result: OutOf<Instance>) => Out) {
  return (instance: Instance, morphism: InOf<typeof fn>['morphism']) => Object.assign(
    Call.of((result: OutOf<Instance>) => {
      return fn({ instance, morphism })(instance.with(result).exec())
    }),
    { previous: instance, morphism }
  ) as IPipedCallMonad<In, Out, UnaryFunction<From, To>, Instance>
}

export function pipe<Instance extends M> (start: Instance, ...calls: M[]) {
  return start.map(x => calls.reduce((y, call) => call.with(y).exec(), x))
}
