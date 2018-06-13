export interface ICallMonad<Out, In = undefined> {
  (arg: In): Out
  pipe: IPipe
}

export interface IPipedCallMonad<Out, Previous extends ICallMonad<any, any>> extends ICallMonad<Out, InOf<Previous>> {
  previous: Previous
  unWrap: () => (arg: OutOf<Previous>) => Out
}

export interface ILift {
  <Out> (fn: NullaryFunction<Out>, thisArg?: any): ICallMonad<Out>
  <In, Out> (fn: UnaryFunction<In, Out>, thisArg?: any): ICallMonad<Out, In>
}

export interface IAll {
  <I1, I2, O1, O2> (m1: ICallMonad<O1, I1>, m2: ICallMonad<O2, I2>): ICallMonad<[O1, O2], [I1, I2]>
  <I1, I2, I3, O1, O2, O3> (m1: ICallMonad<O1, I1>, m2: ICallMonad<O2, I2>, m3: ICallMonad<O3, I3>): ICallMonad<[O1, O2, O3], [I1, I2, I3]>
  <I1, I2, I3, I4, O1, O2, O3, O4> (m1: ICallMonad<O1, I1>, m2: ICallMonad<O2, I2>, m3: ICallMonad<O3, I3>, m4: ICallMonad<O4, I4>): ICallMonad<[O1, O2, O3, O4], [I1, I2, I3, I4]>
  <I1, I2, I3, I4, I5, O1, O2, O3, O4, O5> (m1: ICallMonad<O1, I1>, m2: ICallMonad<O2, I2>, m3: ICallMonad<O3, I3>, m4: ICallMonad<O4, I4>, m5: ICallMonad<O5, I5>): ICallMonad<[O1, O2, O3, O4, O5], [I1, I2, I3, I4, I5]>
}

export interface IOperator<In, Out, M extends Morphism> {
  <Root> (instance: ICallMonad<In, Root>): ICallMonad<Out, Root>
  morphism: M
}

export interface IAggregate {
  <I1, O1, O2, M1 extends Morphism, M2 extends Morphism> (op1: IOperator<I1, O1, M1>, op2: IOperator<O1, O2, M2>): IOperator<I1, O2, UnaryFunction<InOf<M1>, OutOf<M2>>>
  <I1, O1, O2, O3, M1 extends Morphism, M2 extends Morphism, M3 extends Morphism> (op1: IOperator<I1, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>): IOperator<I1, O2, UnaryFunction<InOf<M1>, OutOf<M2>>>
  <I1, O1, O2, O3, O4, M1 extends Morphism, M2 extends Morphism, M3 extends Morphism, M4 extends Morphism> (op1: IOperator<I1, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>, op4: IOperator<O3, O4, M4>): IOperator<I1, O2, UnaryFunction<InOf<M1>, OutOf<M2>>>
  <I1, O1, O2, O3, O4, O5, M1 extends Morphism, M2 extends Morphism, M3 extends Morphism, M4 extends Morphism, M5 extends Morphism> (op1: IOperator<I1, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>, op4: IOperator<O3, O4, M4>, op5: IOperator<O4, O5, M5>): IOperator<I1, O2, UnaryFunction<InOf<M1>, OutOf<M2>>>
  (...operators: IOperator<any, any, any>[]): IOperator<any, any, any>
}

export interface IPipe {
  <I extends ICallMonad<any, any>, O1, M1 extends Morphism> (this: I, op1: IOperator<OutOf<I>, O1, M1>): IPipedCallMonad<O1, I>
  <I extends ICallMonad<any, any>, O1, M1 extends Morphism, O2, M2 extends Morphism> (this: I, op1: IOperator<OutOf<I>, O1, M1>, op2: IOperator<O1, O2, M2>): IPipedCallMonad<O2, I>
  <I extends ICallMonad<any, any>, O1, M1 extends Morphism, O2, M2 extends Morphism, O3, M3 extends Morphism> (this: I, op1: IOperator<OutOf<I>, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>): IPipedCallMonad<O3, I>
  <I extends ICallMonad<any, any>, O1, M1 extends Morphism, O2, M2 extends Morphism, O3, M3 extends Morphism, O4, M4 extends Morphism> (this: I, op1: IOperator<OutOf<I>, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>, op4: IOperator<O3, O4, M4>): IPipedCallMonad<O4, I>
  <I extends ICallMonad<any, any>, O1, M1 extends Morphism, O2, M2 extends Morphism, O3, M3 extends Morphism, O4, M4 extends Morphism, O5, M5 extends Morphism> (this: I, op1: IOperator<OutOf<I>, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>, op4: IOperator<O3, O4, M4>, op5: IOperator<O4, O5, M5>): IPipedCallMonad<O5, I>
}

export type UnaryFunction<In, Out> = (arg: In) => Out
export type NullaryFunction<Out> = () => Out

export type Morphism = UnaryFunction<any, any> | NullaryFunction<any>

export type InOf<T> =
  T extends ICallMonad<any, infer In> ? In :
  T extends IOperator<infer In, any, any> ? In :
  T extends UnaryFunction<infer In, any> ? In :
  T extends NullaryFunction<any> ? undefined :
  any

export type OutOf<T> =
  T extends ICallMonad<infer Out, any> ? Out :
  T extends IOperator<any, infer Out, any> ? Out :
  T extends UnaryFunction<any, infer Out> ? Out :
  T extends NullaryFunction<infer Out> ? Out :
  any
