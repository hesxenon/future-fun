import { assert } from 'chai'
import { Call } from '..'
import { double, ident, increment, stringify } from './test.util'

describe('Call', () => {
  describe('exec', () => {
    it('should not execute the callchain on setup', () => {
      let chainFirstCalled = false
      const c = Call.of((x: number) => {
        chainFirstCalled = true
        return x
      }).chain(Call.of(double))

      let mapFirstCalled = false
      const d = Call.of((x: number) => {
        mapFirstCalled = true
        return x
      }).map(double)

      assert(!chainFirstCalled)
      assert(!mapFirstCalled)
    })

    it('should execute the whole callchain on valueOf()', () => {
      const c = Call.of((x: number) => x).map(x => x * 2).chain(Call.of(x => x + ''))
      assert(c.with(1).exec() === '2')
    })
  })

  describe('map', () => {
    it('should execute directly to a value', () => {
      const c = Call.of(ident).map(double)
      assert(c.with(1).exec() === 2)
      assert(c.map(double).with(1).exec() === 4)
    })
  })

  describe('chain', () => {
    it('should execute directly to a value', () => {
      const c = Call.of(ident).chain(Call.of(double))
      assert(c.with(1).exec() === 2)
    })

    it('should create a reference to the current instance', () => {
      const callToString = Call.of(stringify)
      const callDouble = Call.of(double)
      const a = Call.of(ident)
      const b = a.chain(callDouble)
      const c = b.chain(callToString)

      // if a -> b -> c then c <- b <- a must also be true and represented via .arg
      assert(b.previous === a)
      assert(c.previous === b)
      assert(c.previous.previous === a)
    })

    it('should be possible to chain to any call as long as it resolves to the same type', () => {
      const a = Call.of(ident)
      const conditional = Call.of((x: number) => x > 1 ? double(x) : stringify(x))
      const b = a.chain(conditional)
      assert(b.with(5).exec() === 10)
      assert(b.with(0).exec() === '0')
    })
  })

  describe('all', () => {
    const object = {}
    const a = Call.of((x: number) => x)
    const b = Call.of((x: string) => x)
    const c = Call.of((x: Object) => x)

    it('should be possible to aggregate an array of calls into a single call with all results', () => {
      const [str, num, obj] = Call.all(b, a, c).with(['1', 1, object]).exec()
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
      assert(unit.chain(f).with(x).exec() === f.with(x).exec())
    })

    it('should satisfy right identity', () => {
      const f = Call.of(double)
      assert(f.chain(unit).with(x).exec() === f.with(x).exec())
    })

    it('should satisfy associativity', () => {
      const f = Call.of(double)
      const g = Call.of(increment)
      assert(unit.chain(f).chain(g).with(x).exec() === unit.chain(f.chain(g)).with(x).exec())
    })
  })
})
