import { ICallMonad, IPipedCallMonad } from './types'

export function testCall<In, Out> (call: ICallMonad<Out, In, any>, arg: In) {
  return call._fn(arg)
}

function isPiped (call: ICallMonad<any, any> | IPipedCallMonad<any, any>): call is IPipedCallMonad<any, any> {
  if ((call as IPipedCallMonad<any, any>).previous) {
    return true
  }
  return false
}
