import { Operator, CallFn, Call } from "./types";
import { then } from "./call";

export function map<In, Out>(fn: CallFn<In, Out>, thisArg?: any): Operator<In, Out> {
  return function (previous: Call<In>) {
    const exec = () => fn.call(thisArg, previous.exec())
    return {
      fn, thisArg, previous, exec, then
    }
  }
}
