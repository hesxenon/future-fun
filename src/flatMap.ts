import { CallFn, Call, Operator } from "./types";
import { then } from "./call";

export function flatMap<In, Out>(fn: CallFn<In, Call<Out>>, thisArg?: any): Operator<In, Out> {
  return (previous: Call<In>) => {
    return {
      fn: fn as any,
      thisArg, previous, then,
      exec: () => fn.call(thisArg, previous.exec()).exec()
    }
  }
}
