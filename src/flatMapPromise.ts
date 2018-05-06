import { CallFn, Operator, createOperator, Finish, Call, pipe } from '..'

export function flatMapPromise<In, Resolve> (fn: CallFn<In, Promise<Resolve>>, thisArg?: any): Operator<In, Resolve, Promise<Resolve>> {
  return createOperator(fn, thisArg, (previous, finish) => {
    fn.call(thisArg, previous).then(finish)
  })
}
