export interface Call<Out = any, In = any, Previous = any> {
  fn: CallFn<In, Out>,
  arg?: In,
  exec: () => Out,
  previous: Previous,
  thisArg?: any,
  then: <Out1>(next: Operator<Out, Out1>) => Call<Out1, Out, Call<Out, In, Previous>>
}

export function call<Out, In = any>(fn: CallFn<In, Out>, arg?: In, thisArg?: any): Call<Out, In, undefined> {
  const exec = () => fn.call(thisArg, arg)
  return {
    fn, arg, previous: undefined, thisArg,
    exec,
    then
  }
}

export function then<Out, Previous>(this: Call<Previous>, operator: Operator<Previous, Out>): Call<Out, Previous, Call<Previous>> {
  return Object.assign(operator(this), { previous: this, then })
}

export interface Operator<In, Out> {
  (previous: Call<In>): Call<Out, In>
}

export type CallFn<In, Out> = (arg: In) => Out
