import { IAll, ILift, M, UnaryFunction, ICallMonad, InOf } from './types'
import { map } from './operators/map'
import { flatMapTo } from './operators/flatMapTo'

export namespace Call {
  export const of: ILift = function (fn, thisArg?) {
    return {
      fn,
      with: function (arg) {
        return {
          exec: () => fn.call(thisArg, arg),
          instance: this
        }
      },
      map: function (morphism) {
        return this.pipe(map(morphism))
      },
      chain: function (chained) {
        return this.pipe(flatMapTo(chained))
        // return Object.assign(Call.of((arg) => chained.with(this.with(arg as InOf<typeof fn>).exec()).exec()), { previous: this, chained })
      },
      pipe: function (operator) {
        return Object.assign(Call.of((arg) => operator(this.with(arg as InOf<typeof fn>).exec())), { previous: this, operator })
      }
    }
  }

  export const all: IAll = function (...calls: M[]): M {
    return Call.of((args: any[]) => calls.map((call, i) => call.with(args[i]).exec()))
  }
}
