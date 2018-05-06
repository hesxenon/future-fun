import { ident, double } from './test.util'
import { call } from '../src/call'
import { flatMap } from '../src/flatMap'
import { assert } from 'chai'
import { map, Call } from '..'

describe('flatMap', () => {
  it('should be able to pass on the result of a nested call', done => {
    const c = call(ident, 1).pipe(flatMap(x => call(double, x)))
    c.exec(x => {
      assert(x === 2)
      done()
    })
  })

  it('should be able to resolve mapped calls', done => {
    const apiCall = (x: number) => x + ''
    const parseResponse = parseInt

    const send = (x: number) => call(apiCall, x).pipe(map(parseResponse))

    const c = call(x => x, 1)
      .pipe(flatMap(send))

    c.test(2, ({ out }) => {
      assert(out.previous.fn === apiCall)
    })

    c.exec(x => {
      assert(x === 1)
      done()
    })
  })
})
