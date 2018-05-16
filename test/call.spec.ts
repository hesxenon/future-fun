import { assert } from 'chai'
import { fail } from 'assert'
import { Call, ICallMonad, OutOf, testCall } from '..'
import { double, ident } from './test.util'

describe('Call', () => {
  describe('exec', () => {
    it('should not execute the callchain on setup', () => {
      let chainFirstCalled = false
      const c = Call(x => {
        chainFirstCalled = true
        return x
      }, 1).chain(x => Call(double, x))

      let mapFirstCalled = false
      const d = Call(x => {
        mapFirstCalled = true
        return x
      }, 1).map(double)

      assert(!chainFirstCalled)
      assert(!mapFirstCalled)
    })

    it('should execute the whole callchain on valueOf()', () => {
      const c = Call(x => x, 1).map(x => x * 2).chain(x => Call(x => x + '', x))
      assert(c.valueOf() === '2')
    })
  })

  describe('map', () => {
    it('should execute directly to a value', () => {
      const c = Call(ident, 1).map(double)
      assert(c.valueOf() === 2)
      assert(c.map(double).valueOf() === 4)
    })
  })

  describe('chain', () => {
    it('should execute directly to a value', () => {
      const c = Call(ident, 1).chain(x => Call(double, x))
      assert(c.valueOf() === 2)
    })

    it('should create a reference to the current instance', () => {
      const callToString = (x: number) => Call(toString, x)
      const callDouble = (x: number) => Call(x => x * 2, x)
      const a = Call(ident, 1 as number)
      const b = a.chain(callDouble)
      const c = b.chain(callToString)

      // if a -> b -> c then c <- b <- a must also be true and represented via .arg
      assert(b.arg === a)
      assert(c.arg === b)
      assert(c.arg.arg === a)
    })

    it('should be possible to chain to any call as long as it resolves to the same type', () => {
      const a = Call(x => x, 1)
      const f = (x: number) => Call(double, x)
      const g = (x: number) => Call(ident, x).map(x => x + 1)
      const b = a.chain(x => x > 1 ? f(x) : g(x))
      assert(b.fn(Call(x => x, 5)) === 10)
      assert(b.fn(Call(x => x, 0)) === 1)
    })
  })

  describe('all', () => {
    const object = {}
    const a = Call(x => x, '1')
    const b = Call(x => x, 1)
    const c = Call(x => x, object)

    it('should be possible to aggregate an array of calls into a single call with all results', () => {
      const [str, num, obj] = Call.all(a, b, c).valueOf()
      assert(str === '1')
      assert(num === 1)
      assert(obj === object)
    })
  })

  describe('identity laws', () => {
    const unit = (x: number) => Call(ident, x)
    it('should satisfy left identity', () => {
      const f = (x: number) => Call(double, x)
      const x = 1 as number
      assert(unit(x).chain(f).valueOf() === f(x).valueOf())
    })

    it('should satisfy right identity', () => {
      const c = Call(ident, 1 as number)
      assert(c.chain(unit).valueOf() === c.valueOf())
    })

    it('should satisfy associativity', () => {
      const c = unit(1)
      const f = (x: number) => Call(double, x)
      const g = (x: number) => Call(x => x + 1, x)
      assert(c.chain(f).chain(g).valueOf() === c.chain(x => f(x).chain(g)).valueOf())
    })
  })
})
