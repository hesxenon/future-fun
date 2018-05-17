export interface ICallMonad<In, Out> {
  fn: UnaryFunction<In, Out>
  map: <Instance extends M, Next>(this: Instance, morphism: UnaryFunction<Out, Next>) => IHasPrevious<Out, Next, Instance>,
  chain: <Instance extends M, Next extends ICallMonad<Out, any>>(this: Instance, next: Next) => IHasPrevious<Out, OutOf<Next>, Instance>
  with: (arg: In) => Out
}

export interface IHasPrevious<In, Out, Previous> extends ICallMonad<In, Out> {
  previous: Previous
}

export interface ILift {
  <In, Out>(fn: UnaryFunction<In, Out>): ICallMonad<In, Out>
}

export interface IAll {
  <M1 extends M>(m1: M1): ICallMonad<InOf<M1>, OutOf<M1>>
  <M1 extends M, M2 extends M>(m1: M1, m2: M2): ICallMonad<[InOf<M1>, InOf<M2>], [OutOf<M1>, OutOf<M2>]>
  <M1 extends M, M2 extends M, M3 extends M>(m1: M1, m2: M2, m3: M3): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>], [OutOf<M1>, OutOf<M2>, OutOf<M3>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M>(m1: M1, m2: M2, m3: M3, m4: M4): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>, InOf<M4>], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M>(m1: M1, m2: M2, m3: M3, m4: M4, m5: M5): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>, InOf<M4>, InOf<M5>], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>, OutOf<M5>]>
  (...calls: M[]): ICallMonad<any[], any[]>
}

export type UnaryFunction<In = any, Out = any> = (arg: In) => Out
export type M = ICallMonad<any, any>

export type InOf<C> = C extends ICallMonad<infer In, infer Out> ? In : any
export type OutOf<C> = C extends ICallMonad<infer In, infer Out> ? Out : any
