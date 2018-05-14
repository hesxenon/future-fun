import { assert } from 'chai'
import { fail } from 'assert'
import { Call } from '..'

describe('Call', () => {
  const ident = (x: number) => x
  const double = (x: number) => x * 2
  const toString = (x: number) => x + ''

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

  describe('testing', () => {
    it('should simply execute the calls fn with the passed argument', () => {
      const toTest = Call(ident, 1 as number).map(double).map(toString)
      const setup = Call(ident, 2 as number).map(double)
      assert(toTest.fn(setup) === '4')
    })

    it('should be possible to test flows by passing Call Monads into the fn of a Call', () => {
      // assume these are functions from your program
      const fetchDb = (id: number) => Call(id => {
        fail('the real fetchDb function should never be called since we\'re testing with a fake call!')
        return Promise.resolve(id + '')
      }, id)
      const upload = (data: string) => Call(data => Promise.resolve({ received: data.length < 3, data }), data)

      const fetchAndUpload = (x: number) => fetchDb(x).map(data$ => data$.then(data => upload(data).valueOf()))

      const mockFetchDb = (id: number) => Call(id => Promise.resolve(id + ''), id)
      fetchAndUpload(5).fn(mockFetchDb(10)).then(({ data, received }) => {
        assert(data === '10')
        assert(received)
      })

      fetchAndUpload(5).fn(mockFetchDb(1000)).then(({ received }) => [
        assert(!received)
      ])
    })
  })
})
