import { CallFn, Call, Operator } from './types'

export function call<Out, In = any> (fn: CallFn<In, Out>, arg?: In, thisArg?: any): Call<Out, In, undefined> {
  return {
    fn, arg, previous: undefined, thisArg,
    then: (cb) => cb(fn.call(thisArg, arg)),
    pipe
  }
}

export function pipe<Out, Previous> (this: Call<Previous>, operator: Operator<Previous, Out>): Call<Out, Previous, Call<Previous>> {
  return Object.assign(operator(this), { previous: this, pipe })
}
