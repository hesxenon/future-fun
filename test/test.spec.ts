import { Call } from '..'
import { assert } from 'chai'
import { testCall } from '../src/testing'
import { fail } from 'assert'

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
    assert(testCall(x.arg, 2) === 4)
  })
})
