import { ICallMonad, IChainedCallMonad, IExecutable, IMappedCallMonad, IPipedCallMonad, M, OutOf } from './types'

export function testCall<In, Next extends M, Instance extends M> (call: IChainedCallMonad<In, Next, Instance>, arg: OutOf<Instance>): IExecutable<Next>
export function testCall<In, Out, Instance extends M> (call: IMappedCallMonad<In, Out, Instance>, arg: OutOf<Instance>): Out
export function testCall<In, Out> (call: ICallMonad<In, Out>, arg: In): Out
export function testCall<In, Out> (call: M, arg: any): any {
  if (isMapped(call)) {
    return call.morphism(arg)
  } else if (isChained(call)) {
    return call.chained.with(arg)
  } else if (isPiped(call)) {
    return call.operator(arg)
  }
  return call.with(arg)
}

function isMapped (c: All): c is MM {
  return (c as MM).morphism !== undefined
}

function isChained (c: All): c is CM {
  return (c as CM).chained !== undefined
}

function isPiped (c: All): c is PM {
  return (c as PM).operator !== undefined
}

type All = M | MM | CM | PM
type MM = IMappedCallMonad<any, any, any>
type CM = IChainedCallMonad<any, any, any>
type PM = IPipedCallMonad<any, any, any, any>
