export interface Call<Resolve = any, In = any, Out = any, Previous = any> {
  fn: CallFn<In, Out>,
  arg?: In,
  test: (arg: In | undefined, finish: (result: ExecArg<Resolve, Out>) => void) => void,
  exec: (finish: Finish<Resolve>) => void,
  previous: Previous,
  thisArg?: any,
  pipe: <Resolve, In, Out, PIn, POut, PP>(this: Call<In, PIn, POut, PP>, next: Operator<Resolve, In, Out>) => Call<Resolve, In, Out, typeof this>
}

export interface Operator<Resolve, In, Out> {
  <Previous extends Call>(previous: Previous): Call<Resolve, In, Out, Previous>
}

export interface CallFn<In = any, Out = any> {
  (arg: In): Out
}

export interface Finish<Resolve> {
  (result: Resolve): void
}

export interface ThenArg<Resolve> {
  resolve: Resolve
}

export interface ExecArg<Resolve, Out> {
  out: Out,
  resolve: Resolve
}

export type InferredCall<T> = T extends Call<infer Resolve, infer In, infer Out, infer Previous> ? Call<Resolve, In, Out, Previous> : any
