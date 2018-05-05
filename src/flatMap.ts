import { CallFn, Call, Operator } from "./types";
import { then } from "./call";
import { createOperator } from "./util";

export function flatMap<In, Out>(fn: CallFn<In, Call<Out>>, thisArg?: any): Operator<In, Out> {
  return createOperator(fn, thisArg, (previous) => fn.call(thisArg, previous.exec()).exec())
}
