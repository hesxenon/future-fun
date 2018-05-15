export interface ICallMonad<In, Out> extends ICall<In, Out> {
  chain: <Next, Instance extends this>(this: Instance, f: ChainFn<Out, Next>) => IChainedCallMonad<Instance, Next>,
  map: <Next, Instance extends this>(this: Instance, f: MapFn<Out, Next>) => IMappedCallMonad<Instance, Next>,
  valueOf: () => Out
}

export interface IChainedCallMonad<Instance extends ICallMonad<any, any>, Out> extends ICallMonad<Instance, Out> {
  chainFn: ChainFn<OutOf<Instance>, Out>
}

export interface IMappedCallMonad<Instance extends ICallMonad<any, any>, Out> extends ICallMonad<Instance, Out> {
  mapFn: MapFn<OutOf<Instance>, Out>
}

export type InOf<C> = C extends ICall<infer In, infer Out> ? In : any
export type OutOf<C> = C extends ICall<infer In, infer Out> ? Out : any

export interface ICall<In, Out> { fn: (arg: In) => Out, arg: In, thisArg?: any }

export type ChainFn<In, Out> = (arg: In) => ICallMonad<any, Out>
export type MapFn<In, Out> = (arg: In) => Out
