import { CallFn, Operator, createOperator, Finish } from '..'

export function asyncFlatmap<In, Out> (fn: CallFn<In, FinishReceiver<Out>>, thisArg?: any): Operator<In, Out>
export function asyncFlatmap<In, Out, AsyncType> (fn: CallFn<In, AsyncType>, asyncFn: (asyncInstance: AsyncType) => FinishReceiver<Out>, thisArg?: any): Operator<In, Out>
export function asyncFlatmap<In, Out, AsyncType> (fn: CallFn<In, AsyncType>, asyncFn?: (asyncInstance: AsyncType) => FinishReceiver<Out>, thisArg?: any): Operator<In, Out> {
  return createOperator(fn as any, thisArg, (previous, finish) => {
    const asyncInstance = fn.call(thisArg, previous)
    if (!asyncFn && typeof asyncInstance === 'function') {
      asyncInstance(finish)
    } else if (asyncFn) {
      asyncFn(asyncInstance).call(asyncInstance, finish)
    } else {
      throw new Error('invalid asyncFlatmap, cannot bind to callback nor do I know which method to call!')
    }
  })
}

export type FinishReceiver<T> = (finish: Finish<T>) => void
