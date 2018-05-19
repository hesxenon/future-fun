import { Call } from '../call'
import { IPipedCallMonad, InOf, M, NullaryFunction, OutOf } from '../types'

export const flatMapTo: <To extends M, Instance extends M>(instance: Instance, call: To) => IPipedCallMonad<InOf<Instance>, OutOf<To>, NullaryFunction<To>, Instance> = (instance, call) => {
  return Object.assign(Call.of((result) => call.with(instance.with(result).exec()).exec()), { morphism: () => call, previous: instance })
}
