export interface ICallMonad<In, Out> {
  with: <Instance extends this>(this: Instance, arg: In) => Out
  pipe: IBoundPipe
  map: <Instance extends this, Next>(this: Instance, morphism: UnaryFunction<Out, Next>) => IPipedCallMonad<In, Next, IOperator<Out, Next, UnaryFunction<Out, Next>>, Instance>
  chain: <Instance extends this, Next extends ICallMonad<Out, any>>(this: Instance, next: Next) => IPipedCallMonad<In, OutOf<Next>, IOperator<InOf<Next>, OutOf<Next>, NullaryFunction<Next>>, Instance>
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
  (op1: IOperator<any, any, any>): typeof op1
  <O1, M1 extends Morphism, O2, M2 extends Morphism>(op1: IOperator<any, O1, M1>, op2: IOperator<O1, O2, M2>): IPipedOperator<typeof op1, typeof op2>
  <O1, M1 extends Morphism, O2, M2 extends Morphism, O3, M3 extends Morphism>(op1: IOperator<any, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>): IPipedOperator<IChainedOperator<typeof op1, typeof op2>, typeof op3>
  <O1, M1 extends Morphism, O2, M2 extends Morphism, O3, M3 extends Morphism, O4, M4 extends Morphism>(op1: IOperator<any, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>, op4: IOperator<O3, O4, M4>): IPipedOperator<IChainedOperator<IChainedOperator<typeof op1, typeof op2>, typeof op3>, typeof op4>
  <O1, M1 extends Morphism, O2, M2 extends Morphism, O3, M3 extends Morphism, O4, M4 extends Morphism, O5, M5 extends Morphism>(op1: IOperator<any, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>, op4: IOperator<O3, O4, M4>, op5: IOperator<O4, O5, M5>): IPipedOperator<IChainedOperator<IChainedOperator<IChainedOperator<typeof op1, typeof op2>, typeof op3>, typeof op4>, typeof op5>
  (...operators: Operator[]): Operator
}

export interface IBoundPipe {
  <I extends M, O1, M1 extends Morphism>(this: I, op1: IOperator<OutOf<I>, O1, M1>): IPipedCallMonad<InOf<I>, O1, typeof op1, I>
  <I extends M, O1, M1 extends Morphism, O2, M2 extends Morphism>(this: I, op1: IOperator<OutOf<I>, O1, M1>, op2: IOperator<O1, O2, M2>): IPipedCallMonad<InOf<I>, O2, IPipedOperator<typeof op1, typeof op2>, I>
  <I extends M, O1, M1 extends Morphism, O2, M2 extends Morphism, O3, M3 extends Morphism>(this: I, op1: IOperator<OutOf<I>, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>): IPipedCallMonad<InOf<I>, O3, IPipedOperator<IChainedOperator<typeof op1, typeof op2>, typeof op3>, I>
  <I extends M, O1, M1 extends Morphism, O2, M2 extends Morphism, O3, M3 extends Morphism, O4, M4 extends Morphism>(this: I, op1: IOperator<OutOf<I>, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>, op4: IOperator<O3, O4, M4>): IPipedCallMonad<InOf<I>, OutOfOperator<O2>, IPipedOperator<IChainedOperator<IChainedOperator<typeof op1, typeof op2>, typeof op3>, typeof op4>, I>
  <I extends M, O1, M1 extends Morphism, O2, M2 extends Morphism, O3, M3 extends Morphism, O4, M4 extends Morphism, O5, M5 extends Morphism>(this: I, op1: IOperator<OutOf<I>, O1, M1>, op2: IOperator<O1, O2, M2>, op3: IOperator<O2, O3, M3>, op4: IOperator<O3, O4, M4>, op5: IOperator<O4, O5, M5>): IPipedCallMonad<InOf<I>, OutOfOperator<O2>, IPipedOperator<IChainedOperator<IChainedOperator<IChainedOperator<typeof op1, typeof op2>, typeof op3>, typeof op4>, typeof op5>, I>
  <I extends M>(this: I, ...operators: Operator[]): IPipedCallMonad<InOf<I>, any, any, I>
}

export interface IOperator<In, Out, Mo extends Morphism> {
  <Instance extends ICallMonad<any, In>>(instance: Instance): IPipedCallMonad<any, Out, IOperator<In, Out, Mo>, Instance>
  morphism: Mo
}

export interface IChainedOperator<Previous extends Operator, Instance extends Operator> extends IOperator<OutOfOperator<Previous>, OutOfOperator<Instance>, UnaryFunction<InOf<MorphismOf<Previous>>, OutOf<MorphismOf<Instance>>>> {
  previous: Previous
}

export interface IPipedOperator<Previous extends Operator, Instance extends Operator> extends IOperator<OutOfOperator<PreviousOf<Instance>>, OutOfOperator<Instance>, UnaryFunction<InOf<MorphismOf<Previous>>, OutOf<MorphismOf<Instance>>>> {
  last: Instance & IChainedOperator<Previous, Instance>
}

export type InOfOperator<Op> = Op extends IOperator<infer In, any, any> ? In : any
export type OutOfOperator<Op> = Op extends IOperator<any, infer Out, any> ? Out : any
export type FromOfOperator<Op> = InOf<MorphismOf<Op>>
export type ToOfOperator<Op> = OutOf<MorphismOf<Op>>
export type MorphismOf<Op> = Op extends IOperator<any, any, infer Morphism> ? Morphism :
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
  any
export type PreviousOf<C> =
  C extends IHasPrevious<infer Previous> ? Previous :
  C extends ChainedOperator<infer Previous> ? Previous :
  any
