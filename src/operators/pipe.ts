import { M, IPipedCallMonad, InOf, IPipe } from '../types'

export const pipe: IPipe = <Instance extends M>(instance: Instance, ...ms: M[]) => {
  return instance.map(seed => ms.reduce((y, m) => m.with(y).exec(), seed))
}
