import { assert } from 'chai'
import { Call, map } from '..'
import { double, ident, increment, stringify } from './test.util'
import { flatMapTo } from '../src/operators/flatMapTo'

describe('Call', () => {
  describe('exec', () => {
    it('should not execute the callchain on setup', () => {
      let chainFirstCalled = false
      const c = Call.of((x: number) => {
        chainFirstCalled = true
        return x
      }).pipe(flatMapTo(Call.of(double)))

      let mapFirstCalled = false
      const d = Call.of((x: number) => {
        mapFirstCalled = true
        return x
      }).pipe(map(double))

      assert(!chainFirstCalled)
      assert(!mapFirstCalled)
    })

    it('should execute the whole callchain on valueOf()', () => {
      const c = Call.of((x: number) => x).pipe(map(x => x * 2)).pipe(flatMapTo(Call.of(stringify)))
      assert(c(1) === '2')
    })
  })

  describe('map', () => {
    it('should execute directly to a value', () => {
      const c = Call.of(ident).pipe(map(double))
      assert(c(1) === 2)
      assert(c.pipe(map(double))(1) === 4)
    })
  })

  describe('chain', () => {
    it('should execute directly to a value', () => {
      const c = Call.of(ident).pipe(flatMapTo(Call.of(double)))
      assert(c(1) === 2)
    })

    it('should create a reference to the current instance', () => {
      const callToString = Call.of(stringify)
      const callDouble = Call.of(double)
      const a = Call.of(ident)
      const b = a.pipe(flatMapTo(callDouble))
      const c = b.pipe(flatMapTo(callToString))

      // if a -> b -> c then c <- b <- a must also be true and represented via .previous
      assert(b.previous === a)
      assert(c.previous === b)
      assert(c.previous.previous === a)
    })

    it('should be possible to map to any call as long as it resolves to the same type', () => {
      const a = Call.of(ident)
      const conditional = Call.of((x: number) => x > 1 ? double(x) : stringify(x))
      const b = a.pipe(flatMapTo(conditional))
      assert(b(5) === 10)
      assert(b(0) === '0')
    })
  })

  describe('all', () => {
    const object = {}
    const a = Call.of((x: number) => x)
    const b = Call.of((x: string) => x)
    const c = Call.of((x: Object) => x)

    it('should be possible to aggregate an array of calls into a single call with all results', () => {
      const [str, num, obj] = Call.all(b, a, c)(['1', 1, object])
      assert(str === '1')
      assert(num === 1)
      assert(obj === object)
    })
  })

  describe('identity laws', () => {
    const unit = Call.of(ident)
    const x = 1 as number
    it('should satisfy left identity', () => {
      const f = Call.of(double)
      assert(unit.pipe(flatMapTo(f))(x) === f(x))
    })

    it('should satisfy right identity', () => {
      const f = Call.of(double)
      assert(f.pipe(flatMapTo(unit))(x) === f(x))
    })

    it('should satisfy associativity', () => {
      const f = Call.of(double)
      const g = Call.of(increment)
      const piped = unit.pipe(flatMapTo(f)).pipe(flatMapTo(g))
      const nested = unit.pipe(flatMapTo(f.pipe(flatMapTo(g))))
      assert(piped(x) === nested(x))
    })
  })
})
