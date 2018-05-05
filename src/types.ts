export interface Call<Out = any, In = any, Previous = any> {
  fn: CallFn<In, Out>,
  arg?: In,
  exec: () => Out,
  previous: Previous,
  thisArg?: any,
  then: <Out1>(next: Operator<Out, Out1>) => Call<Out1, Out, Call<Out, In, Previous>>
}

export interface Operator<In, Out> {
  (previous: Call<In>): Call<Out, In>
}

export interface CallFn<In, Out> {
  (arg: In): Out
}
