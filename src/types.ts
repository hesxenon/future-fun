export interface Call<Out = any, In = any, Previous = any> {
  fn: CallFn<In, Out>,
  arg?: In,
  then: (cb: Finish<Out>) => void,
  previous: Previous,
  thisArg?: any,
  pipe: <Out1>(next: Operator<Out, Out1>) => Call<Out1, Out, Call<Out, In, Previous>>
}

export interface Operator<In, Out> {
  (previous: Call<In>): Call<Out, In>
}

export interface CallFn<In, Out> {
  (arg: In): Out
}

export interface Finish<Out> {
  (result: Out): void
}
