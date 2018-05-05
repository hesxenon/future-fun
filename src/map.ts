import { Operator, CallFn, Call } from "./types";
import { then } from "./call";
import { createOperator } from "./util";

export function map<In, Out>(fn: CallFn<In, Out>, thisArg?: any): Operator<In, Out> {
  return createOperator(fn, thisArg, previous => fn.call(thisArg, previous.exec()))
}
