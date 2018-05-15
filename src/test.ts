import { ICallMonad, OutOf, Call, IChainedCallMonad, IMappedCallMonad } from '..'

export function testCall<In extends ICallMonad<any, any>, Out> (call: IChainedCallMonad<In, Out>, arg: OutOf<In>): ICallMonad<OutOf<In>, Out>
export function testCall<In extends ICallMonad<any, any>, Out> (call: IMappedCallMonad<In, Out>, arg: OutOf<In>): Out
export function testCall<In, Out> (call: ICallMonad<In, Out>, arg: In): Out
export function testCall<In, Out> (call: All, arg: OutOf<In>): Out | ICallMonad<OutOf<In>, Out> {
  if (isMapped(call)) {
    return call.mapFn(arg)
  } else if (isChained(call)) {
    return call.chainFn(arg)
  }
  return Call(call.fn, arg, call.thisArg).valueOf()
}

function isMapped (c: All): c is IMappedCallMonad<any, any> {
  return (c as IMappedCallMonad<any, any>).mapFn !== undefined
}

function isChained (c: All): c is IChainedCallMonad<any, any> {
  return (c as IChainedCallMonad<any, any>).chainFn !== undefined
}

type MappedOrChained = IChainedCallMonad<any, any> | IMappedCallMonad<any, any>
type All = ICallMonad<any, any> | MappedOrChained
