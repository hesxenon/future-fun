import { call } from '../src/call'
import { map } from '../src/map'
import { assert } from 'chai'
import { ident, double } from './test.util'

describe('map', () => {
  it('should execute so that B º A is satisfied', done => {
    const c = call(x => x, 1).pipe(map(double))
    c.then(x => {
      assert(x === 2)
      done()
    })
  })
})
