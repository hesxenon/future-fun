export interface ICallMonad<In, Out> extends ICall<In, Out> {
  chain: <Next extends M, Instance extends this>(this: Instance, f: (arg: Out) => Next) => IChainedCallMonad<Instance, OutOf<Next>, Next>,
  map: <Next, Instance extends this>(this: Instance, f: MapFn<Out, Next>) => IMappedCallMonad<Instance, Next>,
  valueOf: () => Out
}

export interface IChainedCallMonad<Instance extends M, Out, Next> extends ICallMonad<Instance, Out> {
  chainFn: MapFn<OutOf<Instance>, Next>
}

export interface IMappedCallMonad<Instance extends M, Out> extends ICallMonad<Instance, Out> {
  mapFn: MapFn<OutOf<Instance>, Out>
}

export interface ILift {
  <In, Out>(fn: (arg: In) => Out, arg: In): ICallMonad<In, Out>
}

export interface IAll {
  <M1 extends M>(m1: M1): ICallMonad<[M1], [OutOf<M1>]>
  <M1 extends M, M2 extends M>(m1: M1, m2: M2): ICallMonad<[M1, M2], [OutOf<M1>, OutOf<M2>]>
  <M1 extends M, M2 extends M, M3 extends M>(m1: M1, m2: M2, m3: M3): ICallMonad<[M1, M2, M3], [OutOf<M1>, OutOf<M2>, OutOf<M3>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M>(m1: M1, m2: M2, m3: M3, m4: M4): ICallMonad<[M1, M2, M3, M4], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M>(m1: M1, m2: M2, m3: M3, m4: M4, m5: M5): ICallMonad<[M1, M2, M3, M4, M5], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>, OutOf<M5>]>
}

export type M = ICallMonad<any, any>

export type InOf<C> = C extends ICall<infer In, infer Out> ? In : any
export type OutOf<C> = C extends ICall<infer In, infer Out> ? Out : any

export interface ICall<In, Out> { fn: (arg: In) => Out, arg: In, thisArg?: any }

export type MapFn<In, Out> = (arg: In) => Out
