import { call } from '../src/call'
import { assert } from 'chai'

describe('call', () => {
  it('should execute to the correct result', done => {
    const c = call(x => x, 1)
    c.exec(x => {
      assert(x === 1)
      done()
    })
  })
})
