import { ICallMonad, IExecutable, IPipedCallMonad, M, OutOf, IOperator } from './types'

export function testCall<In, Next, Instance extends M, O extends IOperator<any, any, any>> (call: IPipedCallMonad<In, Next, O, Instance>, arg: OutOf<Instance>): Next
export function testCall<In, Out> (call: ICallMonad<In, Out>, arg: In): Out
export function testCall<In, Out> (call: M, arg: any): any {
  if (isPiped(call)) {
    return call.operator(arg)
  }
  return call.with(arg).exec()
}

function isPiped (c: All): c is PM {
  return (c as PM).operator !== undefined
}

type All = M | PM
type PM = IPipedCallMonad<any, any, any, any>
