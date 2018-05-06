export interface Call<Resolve = any, In = any, Out = any, Previous = any> {
  fn: CallFn<In, Out>,
  arg?: In,
  exec: (arg: In | undefined, finish: (result: Exec<Resolve, Out>) => void) => void,
  then: (finish: Finish<Resolve>) => void,
  previous: Previous,
  thisArg?: any,
  pipe: PipeFn
}

export interface Operator<In, Out, FnOut> {
  <Previous extends Call>(previous: Previous): Call<Out, In, FnOut, Previous>
}

export interface CallFn<In = any, Out = any> {
  (arg: In): Out
}

export interface Finish<Out> {
  (result: Out): void
}

export interface ThenArg<Resolve> {
  resolve: Resolve
}

export interface Exec<Resolve, Out> {
  out: Out,
  resolve: Resolve
}

export interface PipeFn {
  <In, Out, FnOut, PIn, PFnOut, PP>(this: Call<In, PIn, PFnOut, PP>, next: Operator<In, Out, FnOut>): Call<Out, In, FnOut, typeof this>
}

export type InferredCall<T> = T extends Call<infer Resolve, infer In, infer Out, infer Previous> ? Call<Resolve, In, Out, Previous> : any
