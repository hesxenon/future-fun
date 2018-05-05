import { CallFn, Operator, createOperator } from "..";

export function flatPromise<In, Out>(fn: CallFn<In, Promise<Out>>, thisArg?: any): Operator<In, Out> {
  // throw new Error('not implemented')
  // return createOperator(fn, thisArg, previous => fn.call(thisArg, previous.then()).then())
  return createOperator(fn as any, thisArg, (previous, finish) => {
    const promise: Promise<Out> = fn.call(thisArg, previous)
    promise.then(finish)
  })
}
