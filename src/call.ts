import { ICallMonad } from '..'

export const Call: <In, Out>(fn: (arg: In) => Out, arg: In, thisArg?: any) => ICallMonad<In, Out> = (fn, arg, thisArg) => ({
  chain: function (f) {
    return Call((previous) => {
      const mappedCall = f(previous.valueOf())
      return mappedCall.fn(mappedCall.arg)
    }, this)
  },
  map: function (f) {
    return Call((previous) => f(previous.valueOf()), this)
  },
  valueOf: () => fn.call(thisArg, arg),
  fn, arg, thisArg
})
