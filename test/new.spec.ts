import { assert } from 'chai'

// interface Monad<T> {
//   chain: (f: (arg: T) => Monad<T>) => Monad<T>,
//   map: (f: (arg: T) => Monad<T>) => Monad<Monad<T>>,
//   value: () => T
// }

// const Id: <T>(value: T) => Monad<T> = value => ({
//   chain: f => f(value),
//   map: f => Id(f(value)),
//   value: () => value
// })

// describe('Id', () => {
//   it('should work', () => {
//     const ident = (x: number) => Id(x)
//     const multiply = (factor: number) => (x: number) => Id(x * factor)
//     assert(Id(1).chain(multiply(2)).value() === 2)
//     assert(Id(1).map(multiply(3)).value().value() === 3)
//     assert(Id(1).chain(multiply(2)).chain(multiply(2)).value() === 4)
//   })
// })

interface ICall<In, Out> {
  chain: <Next>(f: (arg: Out) => ICall<Out, Next>) => ICall<Out, Next>,
  map: <Next>(f: (arg: Out) => Next) => ICall<Out, Next>,
  exec: () => Out,
  value: () => { fn: (arg: In) => Out, arg: In },
  arg: In,
  fn: (arg: In) => Out
}

const Call: <In, Out>(fn: (arg: In) => Out, arg: In) => ICall<In, Out> = (fn, arg) => ({
  chain: f => f(fn(arg)),
  map: f => Call(f, fn(arg)),
  exec: () => fn(arg),
  value: () => ({ fn, arg }),
  fn, arg
})

describe('Call', () => {
  it('should work', () => {
    const ident = (x: number) => x
    const double = (x: number) => x * 2
    const toString = (x: number) => x + ''
    const c = Call(ident, 1).map(double)
    const d = Call(ident, 1).chain(x => Call(double, x))
    assert(c.exec() === 2)
    assert(d.exec() === 2)
    assert(d.value().fn === double)
    assert(d.value().arg === 1)
  })

  describe('exec', () => {
    it('should only execute the last/current call', () => {
      let firstCalled = false
      const c = Call(x => {
        firstCalled = true
        return x
      }, 1).map(x => x * 2)

      assert(!firstCalled)
    })
  })
})
