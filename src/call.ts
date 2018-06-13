import { ILift, InOf, IOperator, aggregate, NullaryFunction, UnaryFunction, IAll } from '..'
import { ICallMonad } from './types'

export namespace Call {
  export const of: ILift = function <In, Out> (fn: NullaryFunction<Out> | UnaryFunction<In, Out>, thisArg?: any) {
    return Object.assign(
      function (arg: InOf<typeof fn>) {
        return fn.call(thisArg, arg)
      },
      {
        pipe: function (this: ICallMonad<any, any>, ...operators: IOperator<any, any, any>[]) {
          const transform = aggregate(...operators)
          return Object.assign(transform(this), { previous: this, unWrap: () => transform.morphism })
        }
      }
    )
  }

  export const all: IAll = function (...calls: ICallMonad<any, any>[]): ICallMonad<any, any> {
    return Call.of((args: any[]) => calls.map((call, i) => call(args[i])))
  }
}
