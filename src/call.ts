import { aggregate, IAll, ILift, InOf, IOperator, NullaryFunction, UnaryFunction } from '..'
import { ICallMonad } from './types'

export namespace Call {
  export const of: ILift = function <In, Out> (fn: NullaryFunction<Out> | UnaryFunction<In, Out>, thisArg?: any) {
    return Object.assign(
      function (arg: InOf<typeof fn>) {
        return fn.call(thisArg, arg)
      },
      {
        pipe: function (this: ICallMonad, ...operators: IOperator<any, any, any>[]) {
          const transform = aggregate(...operators)
          return Object.assign(transform(this), { previous: this, _fn: transform.morphism })
        },
        _fn: fn
      }
    )
  }

  export const all: IAll = function (...calls: ICallMonad[]): any {
    return Object.assign(Call.of((args: any[]) => calls.map((call, i) => call(args[i]))), {
      calls
    })
  }
}
