# What is this?
This is a small library that allows you to  define your calls as a testable list of steps that map your abstract data to the specific logic associated with that data.

I.e.: Define a flow for your data in small composable parts and combine those parts to solve the bigger problems.

## Why?
So you can easily *compose* and *test* them

## How?
### 1. The scenario
Suppose you want to write a function that queries a database based on some input and transform the results in order to send them to another system. 

### 2. The problem
Normally you would create something to mock the server or even test against a local full-blown instance of the database. But why is that? You don't want to test the database, do you? The provider of the database should have already tested that.

What you want to test is:
* whether the correct query is being used and whether the result is transformed the way you expect it.  
* how the function behaves if the query returns something unexpected

For that you'd have to write and export a function that takes your arguments and returns a query, and another function that handles the results of the query. Sure, you could do that, but why export functions that have no use otherwise? That are only relevant in the context of this one call?

### 3. The solution
Enter, the future(-fun): with this library you can define a "Call" that does exactly the same with the added benefit that you can structure it into defined "steps" and test each of those steps individually.

Not only does this make every important step of your "function" testable, you can also create some sort of pipelines and combine several pipelines.

For example, in a typical mongodb setup, you could define a call that returns a Database based on some configuration. And then, based on that call, another one that returns all collections. Then, from that, a specific collection.
And all of these calls have the same "root" argument, namely the configuration of the database, a specific collection is, after all, nothing more than the configuration for the database, _enriched with its name_.

## Conclusion
Think of this package as a way to wrap your logic into a list of actions, where each action has a defined (typesafe) input and a defined (typesafe) output. The resulting list gives you access to each action and lets you test this action independently by providing it with fake input. This way you can simulate how the action will behave even though you don't actually have the prerequisites.

# API
# Call
## Call.of
_Create a new `ICallMonad` from scratch a.k.a. lift/of_
```typescript
Call.of: <In, Out>(fn: (arg?: In) => Out, thisArg?: any) => ICallMonad<Out, In>
```
### Input
* `fn` - any function that takes zero or one arguments of type `In` and produces some output of type `Out`
* `thisArg?` - an optional argument on which `fn` will be called. Necessary if you want to pass a function from a certain object i.e. `Promise.resolve` needs `Promise` as `thisArg`

### Output
An `ICallMonad<Out, In>` representing the `fn` as well as the context that enables you to `.pipe` your `fn` into other functions

### Example
```typescript
const c = Call.of((x: number) => Promise.resolve(x))

// executing
const number$ = c(1)

// testing
const testResult = testCall(c, 1)
assert(testResult instanceof Promise)
testResult.then(num => assert(num === 1))
```

##### useless-testing-example-disclaimer: just for demonstration

---

## Call.all
_aggregate any number of calls into a single call_
```typescript
Call.all: (...calls: ICallMonad[]): ICallMonad<any[], any[]>
```
### Input
* `...calls` - the `ICallMonad`s to aggregate
### Output
A new `ICallMonad` that takes an array of all the arguments of the passed calls as its argument and returns all their results

### Example
```typescript
const c = Call.all(Call.of((x: number) => x), Call.of((y: string) => Promise.resolve(y)))

// executing
const [num, str$] = c([1, 'a'])

// testing
const [num, str$] = testCall(c, [1, 'a'])
assert(num === 1)
assert(str$ instanceof Promise)
str$.then(str => assert(str === 'a'))
```

##### note: currently typesafe for up to five calls but can be used with any number of calls
##### useless-testing-example-disclaimer: just for demonstration

---

## call.pipe
_pipe from one call to another_
```typescript
call.pipe: <I extends ICallMonad, O1, M1 extends Morphism> (this: I, op1: IOperator<OutOf<I>, O1, M1>): IPipedCallMonad<O1, I>
```
### Input
* `this` - the instance of an `ICallMonad` that `pipe` is executed on
* `op1 - op5` - the operators used to transform `this` call
### Output
An `IPipedCallMonad<O1, I>` where `I` is the instance of the `ICallMonad<Out, In>` that `.pipe` was called on. This means that the resulting `IPipedCallMonad` takes the result of the previous `ICallMonad` as its argument.
### Example
```typescript 
const c = Call.of((x: number) => x * 2)
  .pipe(map(x => x + ''))

// executing
const stringified = c(1)

// testing
assert(testCall(c.previous, 1) === 2)
assert(testCall(c, 1) === '1')
```
#### Note
It is important to note that with each `.pipe` you create a new `ICallMonad` that has a link to the previous step under `previous`. That is why `testCall(c, 1)` does not double the number but only stringifies it

# Operators
Operators are at the heart of this library and are basically functions that take any instance of an `ICallMonad` and transform the instance into another `ICallMonad`. This can happen based on any morphism you want to implement or statically for things you need really often.

future-fun ships with three basic operators and two utility functions to create them

#### Note
Operators only transform calls, they do not keep track of the "previous step".

---

## map
_map from one value to another_
```typescript
function map<From, To> (morphism: UnaryFunction<From, To>): IOperator<From, To, UnaryFunction<From, To>>
```
### Input
* `morphism` - the function that transforms the output of the previous `ICallMonad` to a new value
### Output
An `IOperator` that transforms the call it is applied on so that it changes the output type of the resulting call to the result of the morphism
### Example
```typescript
const c = Call.of(parseInt)
const double = map((x: number) => x * 2)

// executing
const parseAndDouble = double(c)

// testing
assert(double.morphism(1) === 2)
assert(testCall(parseAndDouble, '1') === 2)
```

---

## flatMap
_map from one value to the result of another `ICallMonad`_
```typescript
function flatMap<From, To> (morphism: UnaryFunction<From, ICallMonad<To, any, From>>): IOperator<From, To, typeof morphism>
```
### Input
* `morphism` - a function that takes the result of the previous `ICallMonad` and returns another `ICallMonad` that takes the same type as its argument
### Output
An `IOperator` that transforms the call it is applied on so that it changes the output type of the resulting call to the result of the `ICallMonad` returned from the `morphism`
### Example
```typescript
const identity = Call.of((x: number) => x)
const stringify = Call.of((x: number) => x + '')
const conditional = flatMap((x: number) => x > 9999 ? stringify : identity)

// executing
const stringifyLarge = conditional(identity)

// testing
assert(conditional.morphism(10000) === stringify)
assert(conditional.morphism(1) === identity)
```

---

## mapPromise
_map the value that a promise will resolve with to another value_
```typescript
function mapPromise<From, To> (morphism: UnaryFunction<From, To | Promise<To>>): IOperator<Promise<From>, Promise<To>, UnaryFunction<From, To | Promise<To>>>
```
### Input
* `morphism` - a function that receives the value the promise is going to resolve with and maps it to another value
### Output
An `IOperator` that transforms the call it is applied on so that it changes the resolved value of the promise returned from the call to a promise that resolves with another value
### Example
```typescript
const doublePromise = mapPromise((x: number) => x * 2)
const identity$ = Call.of((x: number) => Promise.resolve(x))

// executing
const double$ = doublePromise(identity$)

// testing
assert(doublePromise.morphism(1) === 2)
testCall(double$, Promise.resolve(1)).then(num => assert(num === 2))
```

## flatMapTo
_map to the result of a nested `ICallMonad`_
### Example
```typescript
const double = Call.of((x: number) => x).pipe(flatMapTo(Call.of((x: number) => x * 2)))

// executing
assert(double(1) === 2)
```

#### Note
This is technically just an alias to `map`. Works because `ICallMonads` are functions themselves.

---

## aggregate
_put multiple operators together into one_
```typescript
function(...operators: IOperator<any, any, any>[]): IOperator<any, any, any>
```
### Input
* `operators` - any number of `IOperator`s
### Output
A new `IOperator` that simply combines all the morphisms into one and can transform any call by putting it through all the passed operators.
### Example
```typescript
const doubleAndIncrement = aggregate(map((x: number) => x * 2), map((x: number) => x + 1))
const identity = Call.of((x: number) => x)

// executing
const doubleInc = doubleAndIncrement(identity)

// testing
assert(doubleAndIncrement.morphism(1) === 3)
```

---

## createOperator
_create a new custom operator_
```typescript
function createOperator<In, Out> (morphism: UnaryFunction<In, Out> | NullaryFunction<Out>, transform: (result: In) => Out): IOperator<In, Out, typeof morphism>
```
### Input
* `morphism` - a `UnaryFunction` or `NullaryFunction` that defines any mapping from zero or one arguments to any output
* `transform` - the logic for transforming the result of the call the operator is applied on.
### Output
A new `IOperator` that transforms a call that returns `In` into a call that returns `Out`
### Example
```typescript
// actual implementation of `mapPromise` operator
const mapPromise = createOperator(morphism, result => result.then(morphism))
```

---

## Further Examples:
See [demo.spec.ts](./test/demo.spec.ts) (WIP)
