export interface Call<Out = any, In = any, Previous = any> {
  fn: CallFn<In>,
  arg?: In,
  exec: (arg: In | undefined, finish: Finish<Out>) => void,
  then: (finish: Finish<Out>) => void,
  previous: Previous,
  thisArg?: any,
  pipe: PipeFn
}

export interface Operator<In, Out> {
  <Previous extends Call>(previous: Previous): Call<Out, In, Previous>
}

export interface CallFn<In = any, Out = any> {
  (arg: In): Out
}

export interface Finish<Out> {
  (result: Out): void
}

export interface PipeFn {
  <In, Out, FnOut, PIn, PP>(this: Call<In, PIn, PP>, next: Operator<In, Out>): Call<Out, In, typeof this>
}
