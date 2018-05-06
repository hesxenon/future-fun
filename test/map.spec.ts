import { call, map } from '..'
import { assert } from 'chai'
import { double } from './test.util'

describe('map', () => {
  it('should execute so that B º A is satisfied', done => {
    const c = call(x => x, 1).pipe(map(double))
    c.exec(x => {
      assert(x === 2)
      done()
    })
  })
})
