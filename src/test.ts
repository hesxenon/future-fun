import { ICallMonad, IPipedCallMonad, M, OutOf, UnaryFunction } from './types'

export function testCall<In, Next, Instance extends M, Morphism extends UnaryFunction<any, any>> (call: IPipedCallMonad<In, Next, Morphism, Instance>, arg: OutOf<Instance>): OutOf<Morphism>
export function testCall<In, Out> (call: ICallMonad<In, Out>, arg: In): Out
export function testCall<In, Out> (call: M, arg: any): any {
  if (isPiped(call)) {
    return call.morphism(arg)
  }
  return call.with(arg).exec()
}

function isPiped (c: All): c is PM {
  return (c as PM).morphism !== undefined
}

type All = M | PM
type PM = IPipedCallMonad<any, any, any, any>
