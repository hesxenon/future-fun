import { CallFn, Operator, createOperator, Finish, Call, pipe } from '..'

export function flatMapPromise<In, Out> (fn: CallFn<In, Promise<Out>>, thisArg?: any): Operator<In, Out> {
  return createOperator(fn, thisArg, (previous, finish) => {
    fn.call(thisArg, previous).then(finish)
  })
}
