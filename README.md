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
  return Call(({id, num}) => Promise.resolve({id, num}), {id, num})
}

const call = Call(x => x, 1) // lift the function and its argument into the monad, this is the first "action" (let's call it A)
  .map(x => x * 2) // map the result of the previous action A to a new result, this represents action B
  .chain(save) // chain the result with the Call returned from save, this is action C
```
Now `call` is a list of actions `A`, `B` and `C`. This is a very simple example but it shows how to create a flow for your data. The resulting `call` returns a `Promise<{id: number, num: number}>`, and takes the result of the previous action `B` as its argument. This is important because through that we can test how each function behaves:
```typescript
// test A
assert(call.previous.previous.fn(2) === 2) // we execute the function of action A with an argument of 2. This should return the same number
// test B
assert(call.arg.fn(Call(x => x, 2)) === 4) // execute the function of action B. B already takes an `ICallMonad<number, number>` as an argument
```

Because this can get very complicated very fast, the `testCall` utility can come in handy. This utility takes any call and the direct argument to the last monad, lifts these ingredients into a new call and executes it without touching the previous actions of the call.

For more complicated scenarios see [demo.spec.ts](./test/demo.spec.ts) (WIP)

# API
## Call
_Create a new `ICallMonad` from scratch a.k.a. lift/of_
```typescript
Call: <In, Out>(fn: (arg: In) => Out, arg: In, thisArg?: any) => ICallMonad<In, Out>
```
### Input
* `fn` - any function that takes a single argument of type `In` and produces some output of type `Out`
* `arg` - the argument to call the passed `fn` with
* `thisArg?` - an optional argument on which `fn` will be called. Necessary if you want to pass a function from a certain object i.e. `Promise.resolve` needs `Promise` as `thisArg`

### Output
An `ICallMonad<In, Out>` representing the `fn` and `arg` as well as the context that enables you to `.map` and `.chain` your functions

---

## Call.map
_Map the monads value to another value: M(a) => M(b)_
```typescript
Call.map: <Next, Instance extends this>(this: Instance, f: (arg: Out) => Next) => ICallMonad<Instance, Next>
```
### Input
* `f` - the mapping function, takes the `Out` value of the `ICallMonad<In, Out>` it is called on and produces a new value. This is the standard `F(a) -> F(b)` morphism.
### Output
Another `ICallMonad<Instance, Out>` where `Instance` is the instance of the `ICallMonad<In, Out>` that `.map` was called on. This means that the resulting `ICallMonad` takes the previous `ICallMonad` as its argument: 
```typescript 
const a = Call(x => x, 1)
const b = a.map(x => x * 2) // typeof b === ICallMonad<ICallMonad<number, number>, number>
```

---

## Call.chain
_Map the monads value to the output of another monad: M(M(a)) -> M(b)_
```typescript
Call.chain: <_In, Next, Instance extends this>(this: Instance, f: (arg: Out) => ICallMonad<_In, Next>) => ICallMonad<Instance, Next>
```
### Input
* `f` - a function that, again, takes the `Out` value of the monad it was called on and returns an `ICallMonad<_In, Next>`. `_In` being an arbitrary inferred type and `Next` being the type the returned monad produces.
### Output
_see Call.map.Output_

---

## Call.valueOf
_Unwrap the monads value: M(a) -> a_
```typescript
Call.valueOf: () => Out
```
### Input
_no input parameters_
### Output
The final value after running through the entire list of actions as defined
