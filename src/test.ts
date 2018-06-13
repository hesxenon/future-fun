import { ICallMonad, IPipedCallMonad, NullaryFunction, UnaryFunction, OutOf } from './types'

export function testCall<Out, In> (call: ICallMonad<Out, In>, arg: In): Out
export function testCall<Out, Previous extends ICallMonad<any, any>> (call: IPipedCallMonad<Out, Previous>, arg: OutOf<Previous>): Out
export function testCall<Out, In, Previous extends ICallMonad<any, any>> (call: ICallMonad<Out, In> | IPipedCallMonad<Out, Previous>, arg: In | OutOf<Previous>) {
  if (isPiped(call)) {
    return call.unWrap()(arg as OutOf<Previous>)
  }
  return call(arg as In)
}

function isPiped (call: ICallMonad<any, any> | IPipedCallMonad<any, any>): call is IPipedCallMonad<any, any> {
  if ((call as IPipedCallMonad<any, any>).previous) {
    return true
  }
  return false
}
