import { assert } from 'chai'
import { ident, double, stringify } from './test.util'

interface ICallMonad<In, Out> {
  value: UnaryFunction<In, Out>
  flatten: <Instance extends M>(this: Instance) => typeof this['value']
  map: <Instance extends M, Next>(this: Instance, morphism: UnaryFunction<Out, Next>) => IHasPrevious<Out, Next, Instance>,
  chain: <Instance extends M, Next extends M>(this: Instance, morphism: UnaryFunction<Out, Next>) => IHasPrevious<Out, OutOf<Next>, Instance>
  with: (arg: In) => Out
}

interface IHasPrevious<In, Out, Previous> extends ICallMonad<In, Out> {
  previous: Previous
}

interface ILift {
  <In, Out>(fn: UnaryFunction<In, Out>): ICallMonad<In, Out>
}

interface IAll {
  <M1 extends M>(m1: M1): ICallMonad<InOf<M1>, OutOf<M1>>
  <M1 extends M, M2 extends M>(m1: M1, m2: M2): ICallMonad<[InOf<M1>, InOf<M2>], [OutOf<M1>, OutOf<M2>]>
  <M1 extends M, M2 extends M, M3 extends M>(m1: M1, m2: M2, m3: M3): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>], [OutOf<M1>, OutOf<M2>, OutOf<M3>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M>(m1: M1, m2: M2, m3: M3, m4: M4): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>, InOf<M4>], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M>(m1: M1, m2: M2, m3: M3, m4: M4, m5: M5): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>, InOf<M4>, InOf<M5>], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>, OutOf<M5>]>
  (...calls: M[]): ICallMonad<any[], any[]>
}

type UnaryFunction<In = any, Out = any> = (arg: In) => Out
type M = ICallMonad<any, any>

type InOf<C> = C extends ICallMonad<infer In, infer Out> ? In : any
type OutOf<C> = C extends ICallMonad<infer In, infer Out> ? Out : any

namespace Call {
  export const of: ILift = function (fn) {
    return {
      value: fn,
      flatten: function () { return fn },
      map: function (morphism) {
        return Object.assign(Call.of((arg) => morphism(this.with(arg))), { previous: this })
      },
      chain: function (morphism) {
        return Object.assign(Call.of((arg) => morphism(this.with(arg)).with(arg)), { previous: this })
      },
      with: function (arg) {
        return fn(arg)
      }
    }
  }

  export const all: IAll = function (...calls: M[]): M {
    return Call.of((args: any[]) => calls.map((call, i) => call.with(args[i])))
  }
}

describe('call', () => {
  it('should work', () => {
    const a = Call.of(ident)
    const b = a.map(stringify)
    const c = Call.of((x: Object) => x)
    assert(a.flatten() === ident)
    assert(a.map(double).with(2) === 4)
    assert(a.chain(x => Call.of(double)).with(2) === 4)
    assert(b.previous === a)
    assert(b.with(2) === '2')
    assert(b.previous.with(2) === 2)
    const [first, second] = Call.all(a, b).with([1, 2])
    assert(first === 1)
    assert(second === '2')
    const d = Call.all(a, b, c)
    const [num, str, obj] = d.with([1, 2, []])
  })
})
