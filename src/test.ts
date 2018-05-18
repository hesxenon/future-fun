import { ICallMonad, IChainedCallMonad, IMappedCallMonad, M, OutOf, IExecutable } from './types'

export function testCall<In, Next extends M, Instance extends M> (call: IChainedCallMonad<In, Next, Instance>, arg: OutOf<Instance>): IExecutable<Next>
export function testCall<In, Out, Instance extends M> (call: IMappedCallMonad<In, Out, Instance>, arg: OutOf<Instance>): Out
export function testCall<In, Out> (call: ICallMonad<In, Out>, arg: In): Out
export function testCall<In, Out> (call: M, arg: any): any {
  if (isMapped(call)) {
    return call.morphism(arg)
  } else if (isChained(call)) {
    return call.chained.with(arg)
  }
  return call.with(arg)
}

function isMapped (c: All): c is MM {
  return (c as MM).morphism !== undefined
}

function isChained (c: All): c is CM {
  return (c as CM).chained !== undefined
}

type All = M | MM | CM
type MM = IMappedCallMonad<any, any, any>
type CM = IChainedCallMonad<any, any, any>
