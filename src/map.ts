import { Operator, CallFn, Call } from "./types";
import { pipe } from "./call";
import { createOperator } from "./util";

export function map<In, Out>(fn: CallFn<In, Out>, thisArg?: any): Operator<In, Out> {
  return createOperator(fn, thisArg, (previous, finish) => finish(fn.call(thisArg, previous)))
}
