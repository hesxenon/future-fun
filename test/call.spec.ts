import { call } from '../src/call'
import { assert } from 'chai'
import { ident } from './test.util'

describe('call', () => {
  it('should execute to the correct result', done => {
    const c = call(ident, 1)
    c.exec(x => {
      assert(x === 1)
      done()
    })
  })
})
