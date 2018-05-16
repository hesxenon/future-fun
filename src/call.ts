import { ICallMonad, ILift, IAll } from '..'

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
  export const all: IAll = _all
}

function _all (...calls: ICallMonad<any, any>[]): ICallMonad<any, any> {
  return Call.of(calls => calls.map(call => call.valueOf()), calls)
}
