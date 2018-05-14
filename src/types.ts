export interface ICallMonad<In, Resolve> extends ICall<In, Resolve> {
  chain: <_In, Next, Instance extends this>(this: Instance, f: (arg: Resolve) => ICallMonad<_In, Next>) => ICallMonad<Instance, Next>,
  map: <Next, Instance extends this>(this: Instance, f: (arg: Resolve) => Next) => ICallMonad<Instance, Next>,
  valueOf: () => Resolve
}

export type InOf<C> = C extends ICall<infer In, infer Out> ? In : any
export type OutOf<C> = C extends ICall<infer In, infer Out> ? Out : any

export interface ICall<In, Out> { fn: (arg: In) => Out, arg: In }
