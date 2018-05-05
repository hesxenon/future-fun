import { CallFn, Operator, Call } from "./types";
import { then } from "./call";

export function createOperator<In, Out>(fn: CallFn<In, Out>, thisArg: any, exec: (previous: Call<In>) => Out): Operator<In, Out> {
  return (previous: Call<In>) => ({ fn, previous, then, exec: () => exec(previous), thisArg })
}
