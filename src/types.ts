export interface Call<Resolve = any, In = any, Out = any, Previous = any> {
  fn: CallFn<In, Out>,
  arg?: In,
  test: (arg: In | undefined, cb: TestCallback<Resolve, Out>) => void,
  exec: (cb: ExecCallback<Resolve>) => void,
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

export interface ExecCallback<Resolve> {
  (result: Resolve): void
}

export interface ExecArg<Resolve> {
  resolve: Resolve
}

export interface TestCallback<Resolve, Out> {
  (result: TestArg<Resolve, Out>): void
}

export interface TestArg<Resolve, Out> {
  out: Out,
  resolve: Resolve
}

export type InferredCall<T> = T extends Call<infer Resolve, infer In, infer Out, infer Previous> ? Call<Resolve, In, Out, Previous> : any
