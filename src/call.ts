import { ICallMonad } from '..'

export const Call: <In, Out>(fn: (arg: In) => Out, arg: In) => ICallMonad<In, Out> = (fn, arg) => ({
  chain: function (f) {
    return Call(({ fn, arg }) => {
      const mappedCall = f(fn(arg))
      return mappedCall.fn(mappedCall.arg)
    }, this)
  },
  map: function (f) {
    return Call(({ fn, arg }) => f(fn(arg)), this)
  },
  valueOf: () => fn(arg),
  fn, arg
})
