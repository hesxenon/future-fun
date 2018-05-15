import { Call, IChainedCallMonad, ICallMonad, IMappedCallMonad } from '..'
import { assert } from 'chai'
import { testCall } from '../src/test'
import { fail } from 'assert'
import { double, increment } from './test.util'

describe('testCall', () => {
  it('should simply execute the calls fn with the passed argument', () => {
    const toTest = Call(x => x, 1 as number).map(x => x * 2).map(x => x + '')
    assert(testCall(toTest, 2) === '2')
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

    const x = Call(x => x, 1).chain(x => Call(x => x * 2, x)).chain(x => Call(x => x + '', x))
    assert(testCall(x.arg, 2).valueOf() === 4)
  })

  it('should not execute the previous calls', () => {
    const c = Call(x => {
      fail('this should not be called!')
      return x
    }, 1).map(x => x * 2)
    assert(testCall(c, 2).valueOf() === 4)
  })

  it('should return the Call of the mapping function for chained calls', () => {
    const c = Call(x => x, 1).chain(x => Call(double, x))
    assert(testCall(c, 2).fn === double)
  })

  it('should return the result of the mapping function for mapped calls', () => {
    const c = Call(x => x, 1).map(x => x + '')
    assert(testCall(c, 3) === '3')
  })
})
