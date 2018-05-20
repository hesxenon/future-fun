export interface ICallMonad<In, Out> {
  fn: UnaryFunction<In, Out>
  with: <Instance extends this>(this: Instance, arg: In) => IExecutable<Instance>
  pipe: IBoundPipe
  map: <Instance extends this, Next>(this: Instance, morphism: UnaryFunction<Out, Next>) => IPipedCallMonad<In, Next, IOperator<Out, Next, UnaryFunction<Out, Next>>, Instance>
  chain: <Instance extends this, Next extends ICallMonad<Out, any>>(this: Instance, next: Next) => IPipedCallMonad<In, OutOf<Next>, IOperator<InOf<Next>, OutOf<Next>, NullaryFunction<Next>>, Instance>
}

export interface IExecutable<Instance extends M> {
  exec: () => OutOf<Instance>
  instance: Instance
}

export interface IHasPrevious<Previous> {
  previous: Previous
}

export interface IPipedCallMonad<In, Out, Op extends Operator, Instance extends M> extends ICallMonad<In, Out>, IHasPrevious<Instance> {
  operator: Op
}

export interface ILift {
  <In, Out>(fn: UnaryFunction<In, Out>, thisArg?: any): ICallMonad<In, Out>
}

export interface IAll {
  <M1 extends M>(m1: M1): ICallMonad<InOf<M1>, OutOf<M1>>
  <M1 extends M, M2 extends M>(m1: M1, m2: M2): ICallMonad<[InOf<M1>, InOf<M2>], [OutOf<M1>, OutOf<M2>]>
  <M1 extends M, M2 extends M, M3 extends M>(m1: M1, m2: M2, m3: M3): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>], [OutOf<M1>, OutOf<M2>, OutOf<M3>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M>(m1: M1, m2: M2, m3: M3, m4: M4): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>, InOf<M4>], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>]>
  <M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M>(m1: M1, m2: M2, m3: M3, m4: M4, m5: M5): ICallMonad<[InOf<M1>, InOf<M2>, InOf<M3>, InOf<M4>, InOf<M5>], [OutOf<M1>, OutOf<M2>, OutOf<M3>, OutOf<M4>, OutOf<M5>]>
  (...calls: M[]): ICallMonad<any[], any[]>
}

export interface IPipe {
  <O1 extends Operator>(op1: O1): O1
  <O1 extends Operator, O2 extends ChainedOperator<O1>>(op1: O1, op2: O2): IPipedOperator<O1, O2>
  <O1 extends Operator, O2 extends ChainedOperator<O1>, O3 extends ChainedOperator<O2>>(op1: O1, op2: O2, op3: O3): IPipedOperator<IChainedOperator<O1, O2>, O3>
  <O1 extends Operator, O2 extends ChainedOperator<O1>, O3 extends ChainedOperator<O2>, O4 extends ChainedOperator<O3>>(op1: O1, op2: O2, op3: O3, op4: O4): IPipedOperator<IChainedOperator<IChainedOperator<O1, O2>, O3>, O4>
  <O1 extends Operator, O2 extends ChainedOperator<O1>, O3 extends ChainedOperator<O2>, O4 extends ChainedOperator<O3>, O5 extends ChainedOperator<O4>>(op1: O1, op2: O2, op3: O3, op4: O4, op5: O5): IPipedOperator<IChainedOperator<IChainedOperator<IChainedOperator<O1, O2>, O3>, O4>, O5>
  (...chained: Operator[]): Operator
}

export interface IBoundPipe {
  <I extends M, O1 extends Operator>(this: I, op1: O1): IPipedCallMonad<InOf<I>, OutOfOperator<O1>, O1, I>
  <I extends M, O1 extends Operator, O2 extends ChainedOperator<O1>>(this: I, op1: O1, op2: O2): IPipedCallMonad<InOf<I>, OutOfOperator<O2>, IPipedOperator<O1, O2>, I>
  <I extends M, O1 extends Operator, O2 extends ChainedOperator<O1>, O3 extends ChainedOperator<O2>>(this: I, op1: O1, op2: O2, op3: O3): IPipedCallMonad<InOf<I>, OutOfOperator<O2>, IPipedOperator<O1, O3>, I>
  <I extends M, O1 extends Operator, O2 extends ChainedOperator<O1>, O3 extends ChainedOperator<O2>, O4 extends ChainedOperator<O3>>(this: I, op1: O1, op2: O2, op3: O3, op4: O4): IPipedCallMonad<InOf<I>, OutOfOperator<O2>, IPipedOperator<O1, O4>, I>
  <I extends M, O1 extends Operator, O2 extends ChainedOperator<O1>, O3 extends ChainedOperator<O2>, O4 extends ChainedOperator<O3>, O5 extends ChainedOperator<O4>>(this: I, op1: O1, op2: O2, op3: O3, op4: O4, op5: O5): IPipedCallMonad<InOf<I>, OutOfOperator<O2>, IPipedOperator<O1, O5>, I>
  <I extends M>(...chained: Operator[]): IPipedCallMonad<InOf<I>, any, any, I>
}

// export type ReturnWith<Op extends Operator, Instance extends M> =
// Op extends (arg: any) => infer R ? R extends IPipedCallMonad<any, infer Out, infer O, any> ? IPipedCallMonad<InOf<Instance>, Out, O, Instance> : any : any

export interface IOperator<In, Out, Mo extends Morphism> {
  <Instance extends ICallMonad<any, In>>(instance: Instance): IPipedCallMonad<any, Out, IOperator<In, Out, Mo>, Instance>
  morphism: Mo
}

export interface IChainedOperator<Previous extends Operator, Instance extends Operator> extends IOperator<OutOfOperator<Previous>, OutOfOperator<Instance>, UnaryFunction<InOfOperator<Previous>, OutOfOperator<Instance>>> {
  previous: Previous
}

export interface IPipedOperator<Previous extends Operator, Instance extends Operator> extends IOperator<OutOfOperator<PreviousOf<Instance>>, OutOfOperator<Instance>, UnaryFunction<InOfOperator<Previous>, OutOfOperator<Instance>>> {
  last: Instance & IChainedOperator<Previous, Instance>
}

export type InOfOperator<Op> = InOf<MorphismOf<Op>>
export type OutOfOperator<Op> = OutOf<MorphismOf<Op>>
export type MorphismOf<Op> =
  Op extends IOperator<any, any, infer Morphism> ? Morphism :
  any

export interface NullaryFunction<Out> {
  (): Out
}

export interface UnaryFunction<In, Out> {
  (arg: In): Out
}

export type Morphism = UnaryFunction<any, any> | NullaryFunction<any>

export type M = ICallMonad<any, any>
export type Operator<In = any, Out = any, Mo extends Morphism = any> = IOperator<In, Out, Mo>
export type ChainedOperator<Previous extends Operator, Out = any, Mo extends Morphism = any> = Operator<OutOfOperator<Previous>, Out, Mo>

export type InOf<C> = C extends ICallMonad<infer In, infer Out> ? In :
  C extends UnaryFunction<infer In, infer Out> ? In :
  any
export type OutOf<C> = C extends ICallMonad<infer In, infer Out> ? Out :
  C extends NullaryFunction<infer Out> ? Out :
  C extends UnaryFunction<infer In, infer Out> ? Out :
  C extends IExecutable<infer M> ? M extends ICallMonad<any, infer Out> ? Out : any :
  any
export type PreviousOf<C> =
  C extends IHasPrevious<infer Previous> ? Previous :
  C extends ChainedOperator<infer Previous> ? Previous :
  any
