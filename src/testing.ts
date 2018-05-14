import { ICallMonad, OutOf, Call } from '..'

export function testCall<In, Out> ({ fn, thisArg }: ICallMonad<In, Out>, arg: OutOf<In>): Out {
  return Call(fn, arg, thisArg).valueOf()
}
