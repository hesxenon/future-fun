import { ILift, IAll, M, OutOf } from './types'

export namespace Call {
  export const of: ILift = function (fn) {
    return {
      value: fn,
      map: function (morphism) {
        return Object.assign(Call.of((arg) => morphism(this.with(arg))), { previous: this })
      },
      chain: function (next) {
        return Object.assign(Call.of((arg) => next.with(this.with(arg))), { previous: this })
      },
      with: function (arg) {
        return fn(arg)
      }
    }
  }

  export const all: IAll = function (...calls: M[]): M {
    return Call.of((args: any[]) => calls.map((call, i) => call.with(args[i])))
  }
}
