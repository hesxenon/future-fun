import { ICallMonad, InOf, OutOf, ILift } from '..'

/**
 * @deprecated - use Call.of instead
 * Lift the function and its argument (as the value) into the monadic context
 * @param fn the function to be called
 * @param arg the argument of {fn}
 * @param thisArg an optional object to call the {fn} optional
 */
export function Call<In, Out> (fn: (arg: In) => Out, arg: In, thisArg?: any): ICallMonad<In, Out> {
  return {
    chain: function (f) {
      return Object.assign(Call.of((previous) => {
        const mappedCall = f(previous.valueOf())
        return mappedCall.fn(mappedCall.arg)
      }, this), { chainFn: f })
    },
    map: function (f) {
      return Object.assign(Call.of((previous) => f(previous.valueOf()), this), { mapFn: f })
    },
    valueOf: () => fn.call(thisArg, arg),
    fn, arg, thisArg
  }
}

export namespace Call {
  export const of: ILift = Call
  export const all = _all
}

type M = ICallMonad<any, any>

function _all<M1 extends M> (m1: M1): ICallMonad<[M1], OutOf<M1>>
function _all<M1 extends M, M2 extends M> (m1: M1, m2: M2): ICallMonad<[M1, M2], [OutOf<M1>, OutOf<M2>]>
function _all<M1 extends M, M2 extends M, M3 extends M> (m1: M1, m2: M2, m3: M3): ICallMonad<[M1, M2, M3], [OutOf<M1>, OutOf<M2>, OutOf<M3>]>
function _all<M1 extends M, M2 extends M, M3 extends M, M4 extends M> (m1: M1, m2: M2, m3: M3, m4: M4): ICallMonad<[M1, M2, M3, M4], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>]>
function _all<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M> (m1: M1, m2: M2, m3: M3, m4: M4, m5: M5): ICallMonad<[M1, M2, M3, M4, M5], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>, OutOf<M5>]>
function _all (...calls: ICallMonad<any, any>[]): ICallMonad<any, any[]> {
  return Call.of(calls => calls.map(call => call.valueOf()), calls)
}
