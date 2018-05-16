export interface ICallMonad<In, Out> extends ICall<In, Out> {
  chain: <Next extends ICallMonad<any, any>, Instance extends this>(this: Instance, f: (arg: Out) => Next) => IChainedCallMonad<Instance, OutOf<Next>, Next>,
  map: <Next, Instance extends this>(this: Instance, f: MapFn<Out, Next>) => IMappedCallMonad<Instance, Next>,
  valueOf: () => Out
}

export interface IChainedCallMonad<Instance extends ICallMonad<any, any>, Out, Next> extends ICallMonad<Instance, Out> {
  chainFn: MapFn<OutOf<Instance>, Next>
}

export interface IMappedCallMonad<Instance extends ICallMonad<any, any>, Out> extends ICallMonad<Instance, Out> {
  mapFn: MapFn<OutOf<Instance>, Out>
}

export type InOf<C> = C extends ICall<infer In, infer Out> ? In : any
export type OutOf<C> = C extends ICall<infer In, infer Out> ? Out : any

export interface ICall<In, Out> { fn: (arg: In) => Out, arg: In, thisArg?: any }

export type MapFn<In, Out> = (arg: In) => Out
