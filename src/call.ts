import { IAll, ILift, M, UnaryFunction, ICallMonad } from './types'

export namespace Call {
  export const of: ILift = function (fn, thisArg?) {
    return {
      fn,
      with: function (arg) {
        return fn.call(thisArg, arg)
      },
      map: function (morphism) {
        return Object.assign(Call.of((arg) => morphism(this.with(arg))), { previous: this, morphism })
      },
      chain: function (chained) {
        return Object.assign(Call.of((arg) => chained.with(this.with(arg))), { previous: this, chained })
      },
      pipe: function (op) {
        return this.map((arg) => op(this).with(this.with(arg)))
      }
    }
  }

  export const all: IAll = function (...calls: M[]): M {
    return Call.of((args: any[]) => calls.map((call, i) => call.with(args[i])))
  }
}
