# What is this?
This is a small package to wrap your calls into monads.

## Why?
So you can easily *compose* and *test* them

## How?
Suppose you want to query a database and transform the results in order to send them to another system. If you were to imperatively do this you could only test this with an integration test and that requires that you actually have the aforementioned database. Not only does this make your tests slow, it also makes them a tiny bit unreliable because the connection could fail (it's I/O after all). But the worst part is, that you're basically testing someone else's functionality, namely the provider of the database driver. You should be able to assume that e.g. `db.query` works correctly, given that you're giving it the correct parameters.

### db.query -> transform -> send
So, if `db.query` works correctly anyway, why can't we just test our business logic - namely the transforming of the data - by passing in a fake result? Sure, we could already do this if we export the transform function and write a unit test for this. Maybe that's not such a bad idea, but I'm fairly certain that you'll end up with a lot of transformers and other functions like them.  
The solution here is to wrap the functions into `ICallMonad`s which you can then map and chain and in the end, when you really need it, execute them.

## Conclusion
Think of this package as a way to wrap your logic into a list of actions, where each action has a defined (typesafe) input and a defined (typesafe) output. The resulting list gives you access to each action and lets you test this action independently by providing it with fake input. This way you can simulate how the action will behave even though you don't actually have the prerequisites.

### Example:
```typescript
// just a little mock "database"
const storage = {}
function save(num: number) {
  const id = Object.keys(storage).length
  storage[id] = num
  return Promise.resolve({id, num})
}

const call = Call.of(x => x) // lift the function and its argument into the monad, this is the first "action" (let's call it A)
  .map(x => x * 2) // map the result of the previous action A to a new result, this represents action B
  .chain(Call.of(save)) // chain the result with the Call returned from save, this is action C
```
Now `call` is a list of actions `A`, `B` and `C`. This is a very simple example but it shows how to create a flow for your data. The resulting `call` returns a `Promise<{id: number, num: number}>`, and takes the result of the previous action `B` as its argument. This is important because through that we can test how each function behaves:
```typescript
// test A
assert(testCall(call.previous.previous, 2) === 2) // we execute the function of action A with an argument of 2. This should return the same number
// test B
assert(testCall(call.previous, 2) === 4) // execute the function of action B with 2, which should double the number
```

This does not look too different compared to the regular execution with `with`, but the very important difference is that `testCall` does not touch any action before the passed call, so with this it is possible to individually and independently test each action of a call.

For more complicated scenarios see [demo.spec.ts](./test/demo.spec.ts) (WIP)

# API
## Call.of
_Create a new `ICallMonad` from scratch a.k.a. lift/of_
```typescript
Call.of: <In, Out>(fn: (arg: In) => Out, thisArg?: any) => ICallMonad<In, Out>
```
### Input
* `fn` - any function that takes a single argument of type `In` and produces some output of type `Out`
* `thisArg?` - an optional argument on which `fn` will be called. Necessary if you want to pass a function from a certain object i.e. `Promise.resolve` needs `Promise` as `thisArg`

### Output
An `ICallMonad<In, Out>` representing the `fn` as well as the context that enables you to `.map` and `.chain` your `fn`

---

## Call.all
_aggregate any number of calls into a single call_
```typescript
Call.all: (...calls: ICallMonad<any, any>[]): ICallMonad<any[], any[]>
```
### Input
* `...calls` - the `ICallMonad`s to aggregate
### Output
A new `ICallMonad` that takes all the passed calls as its argument and returns all their results if executed

##### note: currently typesafe for up to five calls

---

## Call.map
_Map the monads value to another value: M(a) => M(b)_
```typescript
Call.map: <Instance extends M, Next>(this: Instance, morphism: UnaryFunction<Out, Next>) => IMappedCallMonad<In, Next, Instance>
```
### Input
* `morphism` - the mapping function, takes the `Out` value of the `ICallMonad<In, Out>` it is called on as  its argument and produces a new value. This is the standard `F(a) -> F(b)` morphism.
### Output
Another `IMappedCallMonad<In, Out, Instance>` where `Instance` is the instance of the `ICallMonad<In, Out>` that `.map` was called on. This means that the resulting `IMappedCallMonad` takes the result of the previous `ICallMonad` as its argument.
### Example
```typescript 
const a = Call(x => x, 1)
const b = a.map(x => x * 2)
```

---

## Call.chain
_Map the monads value to the output of another monad: M(M(a)) -> M(b)_
```typescript
Call.chain: <Instance extends M, Next extends ICallMonad<Out, any>>(this: Instance, next: Next) => IChainedCallMonad<In, Next, Instance>
```
### Input
* `next` - Another instance of `ICallMonad<any, any>`
### Output
Another `IChainedCallMonad<In, Next, Instance>` where `Instance` is the instance that `.chain` was called on. The given call instance also takes the result of the previous call as its argument.

---

## Call.with
_Unwrap the monads value: M(a) -> a_
```typescript
Call.with: (arg: In) => Out
```
### Input
* `arg` - the parameter of the FIRST call in the callchain.
### Output
The final value after running through the entire list of actions as defined

## Call.pipe
_transform the result with more complex operators _
```typescript
Call.pipe: <Instance extends this, Next>(this: Instance, op: IOperator<Out, Next>) => IMappedCallMonad<In, Next, Instance>
```
### Input
* `op` - an `IOperator<Out, Next>` where `Out` is the value of the current call and `Next` is the mapped value. See [operators](##Operators)
### Output
A mapped call that will map based on whatever you implement

## Operators
An operator is meant to map a given result to another output, specifically to an output based on a morphism that's passed beforehand. This is easier explained with a demo, so see [pipe.spec.ts](./test/pipe.spec.ts) and [mapPromise.spec.ts](./src/operators/mapPromise.ts)

The `mapPromise` function takes an arbitrary morphism and applies it to the result of a promise that will be returned by the call on which pipe was called.
