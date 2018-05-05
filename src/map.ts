import { CallFn, Call, then } from "./call";

export function map<In, Out>(fn: CallFn<In, Out>, thisArg?: any): (previous: Call<In>) => Call<Out, In> {
  return function (previous: Call<In>) {
    const exec = () => fn.call(thisArg, previous.exec())
    return {
      fn, thisArg, previous, exec, then
    }
  }
}
