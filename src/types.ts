export interface Call<Resolve = any, In = any, Out = any, Previous = any> {
  fn: CallFn<In, Out>,
  arg?: In,
  exec: CallFn<In, Resolve>,
  previous: Previous,
  thisArg?: any,
  pipe: <Resolve, In, Out, Instance extends this>(this: Call<In, InOf<Instance>, OutOf<Instance>, PreviousOf<Instance>>, next: Operator<Resolve, In, Out>) => Call<Resolve, In, Out, typeof this>
}

export interface Operator<Resolve, In, Out> {
  <Previous extends Call>(previous: Call<In, InOf<Previous>, OutOf<Previous>, PreviousOf<Previous>>): Call<Resolve, In, Out, Call<In, InOf<Previous>, OutOf<Previous>, PreviousOf<Previous>>>
}

export interface CallFn<In = any, Out = any> {
  (arg: In): Out
}

export interface ExecCallback<Resolve> {
  (result: Resolve): void
}

export interface ExecArg<Resolve> {
  resolve: Resolve
}

export type InferredCall<T> = T extends Call<infer Resolve, infer In, infer Out, infer Previous> ? Call<Resolve, In, Out, Previous> : any
export type ResolveOf<T> = T extends Call<infer Resolve> ? Resolve : any
export type InOf<T> = T extends Call<infer Resolve, infer In> ? In : any
export type OutOf<T> = T extends Call<infer Resolve, infer In, infer Out> ? Out : any
export type PreviousOf<T> = T extends Call<infer Resolve, infer In, infer Out, infer Previous> ? Previous : any
