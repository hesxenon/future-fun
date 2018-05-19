export interface ICallMonad<In, Out> {
  fn: UnaryFunction<In, Out>
  with: <Instance extends this>(this: Instance, arg: In) => IExecutable<Instance>
  map: <Instance extends this, Next>(this: Instance, morphism: UnaryFunction<Out, Next>) => IPipedCallMonad<InOf<Instance>, Next, UnaryFunction<OutOf<Instance>, Next>, Instance>
  chain: <Instance extends this, Next extends M>(this: Instance, next: Next) => IPipedCallMonad<InOf<Instance>, OutOf<Next>, NullaryFunction<Next>, Instance>
}

export interface IExecutable<Instance extends M> {
  exec: () => OutOf<Instance>
  instance: Instance
}

export interface IHasPrevious<Previous> {
  previous: Previous
}

export interface IPipedCallMonad<In, Out, Morphism extends UnaryFunction<any, any>, Instance extends M> extends ICallMonad<In, Out>, IHasPrevious<Instance> {
  morphism: Morphism
}

export interface ILift {
  <In, Out>(fn: UnaryFunction<In, Out>, thisArg?: any): ICallMonad<In, Out>
}

export interface IAll {
  <M1 extends M>(m1: M1): ICallMonad<InOf<M1>, OutOf<M1>>
  <M1 extends M, M2 extends M>(m1: M1, m2: M2): ICallMonad<[InOf<M1>, InOf<M2>], [OutOf<M1>, OutOf<M2>]>
  <M1 extends M, M2 extends M, M3 extends M>(m1: M1, m2: M2, m3: M3): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>], [OutOf<M1>, OutOf<M2>, OutOf<M3>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M>(m1: M1, m2: M2, m3: M3, m4: M4): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>, InOf<M4>], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M>(m1: M1, m2: M2, m3: M3, m4: M4, m5: M5): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>, InOf<M4>, InOf<M5>], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>, OutOf<M5>]>
  (...calls: M[]): ICallMonad<any[], any[]>
}

export interface NullaryFunction<Out> {
  (): Out
}

export interface UnaryFunction<In, Out> {
  (arg: In): Out
}
export type M = ICallMonad<any, any>

export type InOf<C> = C extends ICallMonad<infer In, infer Out> ? In :
  C extends UnaryFunction<infer In, infer Out> ? In : any
export type OutOf<C> = C extends ICallMonad<infer In, infer Out> ? Out :
  C extends UnaryFunction<infer In, infer Out> ? Out :
  C extends IExecutable<infer M> ? M extends ICallMonad<any, infer Out> ? Out : any : any
export type PreviousOf<C> = C extends IHasPrevious<infer Previous> ? Previous : any
