import { ICallMonad } from '..'

export const Call: <In, Out>(fn: (arg: In) => Out, arg: In, thisArg?: any) => ICallMonad<In, Out> = (fn, arg, thisArg) => ({
  chain: function (f) {
    return Object.assign(Call((previous) => {
      const mappedCall = f(previous.valueOf())
      return mappedCall.fn(mappedCall.arg)
    }, this), { chainFn: f })
  },
  map: function (f) {
    return Object.assign(Call((previous) => f(previous.valueOf()), this), { mapFn: f })
  },
  valueOf: () => fn.call(thisArg, arg),
  fn, arg, thisArg
})
