import { ICallMonad, IChainedCallMonad, IExecutable, IPipedCallMonad, M, OutOf, IOperator } from './types'

export function testCall<In, Next, Instance extends M, O extends IOperator<any, any, any>> (call: IPipedCallMonad<In, Next, O, Instance>, arg: OutOf<Instance>): Next
export function testCall<In, Next extends M, Instance extends M> (call: IChainedCallMonad<In, Next, Instance>, arg: OutOf<Instance>): IExecutable<Next>
export function testCall<In, Out> (call: ICallMonad<In, Out>, arg: In): Out
export function testCall<In, Out> (call: M, arg: any): any {
  if (isPiped(call)) {
    return call.operator(arg)
  } else if (isChained(call)) {
    return call.chained.with(arg)
  }
  return call.with(arg)
}

function isChained (c: All): c is CM {
  return (c as CM).chained !== undefined
}

function isPiped (c: All): c is PM {
  return (c as PM).operator !== undefined
}

type All = M | CM | PM
type CM = IChainedCallMonad<any, any, any>
type PM = IPipedCallMonad<any, any, any, any>
