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
      chain: function (chained) {
        return flatMapTo(chained)(this as any) // TODO check why Out cannot be assigned to InOf<typeof piped>
      }
    }
  }

  export const all: IAll = function (...calls: M[]): M {
    return Call.of((args: any[]) => calls.map((call, i) => call.with(args[i]).exec()))
  }
}
