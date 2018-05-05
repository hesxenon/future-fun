export interface Call<Out = any, In = any, FnOut = Out, Previous = undefined> {
  fn: CallFn<In, FnOut>,
  arg?: In,
  then: (finish: Finish<Out>) => void,
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

export interface PipeFn {
  <In, Out, FnOut, PIn, PFnOut, PP>(this: Call<In, PIn, PFnOut, PP>, next: Operator<In, Out, FnOut>): Call<Out, In, FnOut, typeof this>
}
