import { flatMapTo } from './operators/flatMapTo'
import { map } from './operators/map'
import { IAll, ILift, M } from './types'

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
        return map(morphism)(this)
      },
      chain: function (piped) {
        return flatMapTo(this, piped)
      }
    }
  }

  export const all: IAll = function (...calls: M[]): M {
    return Call.of((args: any[]) => calls.map((call, i) => call.with(args[i]).exec()))
  }
}
