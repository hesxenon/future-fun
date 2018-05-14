export interface ICallMonad<In, Out> extends ICall<In, Out> {
  chain: <_In, Next, Instance extends this>(this: Instance, f: (arg: Out) => ICallMonad<_In, Next>) => ICallMonad<Instance, Next>,
  map: <Next, Instance extends this>(this: Instance, f: (arg: Out) => Next) => ICallMonad<Instance, Next>,
  valueOf: () => Out
}

export type InOf<C> = C extends ICall<infer In, infer Out> ? In : any
export type OutOf<C> = C extends ICall<infer In, infer Out> ? Out : any

export interface ICall<In, Out> { fn: (arg: In) => Out, arg: In, thisArg?: any }
