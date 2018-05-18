export interface ICallMonad<In, Out> {
  fn: UnaryFunction<In, Out>
  with: UnaryFunction<In, Out>
  map: <Instance extends M, Next>(this: Instance, morphism: UnaryFunction<Out, Next>) => IMappedCallMonad<In, Next, Instance>
  chain: <Instance extends M, Next extends ICallMonad<Out, any>>(this: Instance, next: Next) => IChainedCallMonad<In, Next, Instance>
  pipe: <Instance extends M, Next>(this: Instance, op: IOperator<Out, Next>) => IMappedCallMonad<In, Next, Instance>
}

export interface IHasPrevious<Previous> {
  previous: Previous
}

export interface IMappedCallMonad<In, Out, Previous extends M> extends ICallMonad<In, Out>, IHasPrevious<Previous> {
  morphism: UnaryFunction<OutOf<Previous>, Out>
}

export interface IChainedCallMonad<In, Chained extends M, Previous extends M> extends ICallMonad<In, OutOf<Chained>>, IHasPrevious<Previous> {
  chained: Chained
}

export interface ILift {
  <In, Out>(fn: UnaryFunction<In, Out>, thisArg?: any): ICallMonad<In, Out>
}

export interface IOperator<From, To> {
  <Previous extends ICallMonad<any, From>>(previous: Previous): IMappedCallMonad<From, To, Previous>
}

export interface IAll {
  <M1 extends M>(m1: M1): ICallMonad<InOf<M1>, OutOf<M1>>
  <M1 extends M, M2 extends M>(m1: M1, m2: M2): ICallMonad<[InOf<M1>, InOf<M2>], [OutOf<M1>, OutOf<M2>]>
  <M1 extends M, M2 extends M, M3 extends M>(m1: M1, m2: M2, m3: M3): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>], [OutOf<M1>, OutOf<M2>, OutOf<M3>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M>(m1: M1, m2: M2, m3: M3, m4: M4): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>, InOf<M4>], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M>(m1: M1, m2: M2, m3: M3, m4: M4, m5: M5): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>, InOf<M4>, InOf<M5>], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>, OutOf<M5>]>
  (...calls: M[]): ICallMonad<any[], any[]>
}

export interface UnaryFunction<In, Out> {
  (arg: In): Out
}
export type M = ICallMonad<any, any>

export type InOf<C> = C extends ICallMonad<infer In, infer Out> ? In : any
export type OutOf<C> = C extends ICallMonad<infer In, infer Out> ? Out : any
