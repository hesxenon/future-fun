import { CallFn, Operator, Call } from '..'
import { createOperator } from './util'

export function flatMapPromise<Resolve, In> (fn: CallFn<In, Promise<Resolve>>, thisArg?: any): Operator<Resolve, In, Promise<Resolve>> {
  return createOperator(fn, thisArg, (previous, finish) => {
    fn.call(thisArg, previous).then(finish)
  })
}
