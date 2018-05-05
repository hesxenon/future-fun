import { CallFn, Call, Operator } from "./types";

export function call<Out, In = any>(fn: CallFn<In, Out>, arg?: In, thisArg?: any): Call<Out, In, undefined> {
  const exec = () => fn.call(thisArg, arg)
  return {
    fn, arg, previous: undefined, thisArg,
    exec,
    then
  }
}

export function then<Out, Previous>(this: Call<Previous>, operator: Operator<Previous, Out>): Call<Out, Previous, Call<Previous>> {
  return Object.assign(operator(this), { previous: this, then })
}
