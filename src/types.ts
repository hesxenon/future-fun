export interface ICallMonad<Out = any, In = any, Root = In> {
  (arg: Root): Out
  pipe: IPipe
  _fn: (arg: In) => Out
}

export interface IPipedCallMonad<Out, Previous extends ICallMonad> extends ICallMonad<Out, OutOf<Previous>, InOf<Previous>> {
  previous: Previous
}

export interface IAllCallMonad<Calls extends ICallMonad[]> extends ICallMonad<OutOfAll<Calls>, InOfAll<Calls>> {
  calls: Calls
}

export interface ILift {
  <Out> (fn: NullaryFunction<Out>, thisArg?: any): ICallMonad<Out>
  <In, Out> (fn: UnaryFunction<In, Out>, thisArg?: any): ICallMonad<Out, In>
}

export interface IAll {
  <M1 extends ICallMonad, M2 extends ICallMonad> (m1: M1, m2: M2): IAllCallMonad<[M1, M2]>
  <M1 extends ICallMonad, M2 extends ICallMonad, M3 extends ICallMonad> (m1: M1, m2: M2, m3: M3): IAllCallMonad<[M1, M2, M3]>
  <M1 extends ICallMonad, M2 extends ICallMonad, M3 extends ICallMonad, M4 extends ICallMonad> (m1: M1, m2: M2, m3: M3, m4: M4): IAllCallMonad<[M1, M2, M3, M4]>
  <M1 extends ICallMonad, M2 extends ICallMonad, M3 extends ICallMonad, M4 extends ICallMonad, M5 extends ICallMonad> (m1: M1, m2: M2, m3: M3, m4: M4, m5: M5): IAllCallMonad<[M1, M2, M3, M4, M5]>
  (...calls: ICallMonad[]): IAllCallMonad<typeof calls>
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

export type InOfAll<T> =
  T extends [ICallMonad<any, infer I1>, ICallMonad<any, infer I2>] ? [I1, I2] :
  T extends [ICallMonad<any, infer I1>, ICallMonad<any, infer I2>, ICallMonad<any, infer I3>] ? [I1, I2, I3] :
  T extends [ICallMonad<any, infer I1>, ICallMonad<any, infer I2>, ICallMonad<any, infer I3>, ICallMonad<any, infer I4>] ? [I1, I2, I3, I4] :
  T extends [ICallMonad<any, infer I1>, ICallMonad<any, infer I2>, ICallMonad<any, infer I3>, ICallMonad<any, infer I4>, ICallMonad<any, infer I5>] ? [I1, I2, I3, I4, I5] :
  any[]

export type OutOfAll<T> =
  T extends [ICallMonad<infer O1>, ICallMonad<infer O2>] ? [O1, O2] :
  T extends [ICallMonad<infer O1>, ICallMonad<infer O2>, ICallMonad<infer O3>] ? [O1, O2, O3] :
  T extends [ICallMonad<infer O1>, ICallMonad<infer O2>, ICallMonad<infer O3>, ICallMonad<infer O4>] ? [O1, O2, O3, O4] :
  T extends [ICallMonad<infer O1>, ICallMonad<infer O2>, ICallMonad<infer O3>, ICallMonad<infer O4>, ICallMonad<infer O5>] ? [O1, O2, O3, O4, O5] :
  any[]
