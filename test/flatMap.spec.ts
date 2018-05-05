import { ident, double } from './test.util'
import { call } from '../src/call'
import { flatMap } from '../src/flatMap'
import { assert } from 'chai'
import { map } from '..'

describe('flatMap', () => {
  it('should be able to pass on the result of a nested call', done => {
    const c = call(ident, 1).pipe(flatMap(x => call(double, x)))
    c.then(x => {
      assert(x === 2)
      done()
    })
  })

  it('should be able to resolve mapped calls', done => {
    const apiCall = (x: number) => x + ''
    const parseResponse = parseInt
    const c = call(x => x, 1)
      .pipe(map(x => call(apiCall, x).pipe(map(parseResponse))))

    c.exec(2, ({ previous: { fn } }) => {
      assert(fn === apiCall)
    })

    c.pipe(flatMap(x => x)).then(x => {
      assert(x === 1)
      done()
    })
  })
})
