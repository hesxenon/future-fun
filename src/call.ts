import { IAll, ILift, M } from './types'

export namespace Call {
  export const of: ILift = function (fn) {
    return {
      with: fn,
      map: function (morphism) {
        return Object.assign(Call.of((arg) => morphism(this.with(arg))), { previous: this, morphism })
      },
      chain: function (chained) {
        return Object.assign(Call.of((arg) => chained.with(this.with(arg))), { previous: this, chained })
      }
    }
  }

  export const all: IAll = function (...calls: M[]): M {
    return Call.of((args: any[]) => calls.map((call, i) => call.with(args[i])))
  }
}
