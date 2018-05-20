import { ICallMonad, IPipedCallMonad, InOfOperator, M, NullaryFunction, Operator, OutOfOperator, UnaryFunction } from './types'

export function testCall<In, Next, Instance extends M, Op extends Operator<any, any, NullaryFunction<any>>> (call: IPipedCallMonad<In, Next, Op, Instance>): OutOfOperator<Op>
export function testCall<In, Next, Instance extends M, Op extends Operator<any, any, UnaryFunction<any, any>>> (call: IPipedCallMonad<In, Next, Op, Instance>, arg: InOfOperator<Op>): OutOfOperator<Op>
export function testCall<In, Out> (call: ICallMonad<In, Out>, arg: In): Out
export function testCall<In, Out> (call: M, arg?: any): any {
  if (isPiped(call)) {
    return call.operator.morphism(arg)
  }
  return call.with(arg)
}

function isPiped (c: All): c is IPipedCallMonad<any, any, any, any> {
  return (c as PM).operator !== undefined
}

type All = M | PM
type PM = IPipedCallMonad<any, any, any, any>
