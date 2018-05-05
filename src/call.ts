export interface Call<Out = any, In = any, Previous = any> {
  fn: CallFn<In, Out>,
  arg?: In,
  exec: () => Out,
  previous: Previous,
  thisArg?: any,
  then: <Out1>(next: ReturnType<Operator<Out, Out1>>) => Call<Out1, Out, Call<Out, In, Previous>>
}

export function call<Out, In = any>(fn: CallFn<In, Out>, arg?: In, thisArg?: any): Call<Out, In, undefined> {
  const exec = () => fn.call(thisArg, arg)
  return {
    fn, arg, previous: undefined, thisArg,
    exec,
    then
  }
}

export function then<Out, Previous>(this: Call<Previous>, operatorResult: ReturnType<Operator<Previous, Out>>): Call<Out, Previous, Call<Previous>> {
  return Object.assign(operatorResult(this), { previous: this, then })
}

export interface Operator<In, Out> {
  (fn: CallFn<In, Out>, thisArg: any): (previous: Call<In>) => Call<Out, In>
}

export type CallFn<In, Out> = (arg: In) => Out
