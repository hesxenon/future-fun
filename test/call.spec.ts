import { call } from '../src/call'
import { assert } from 'chai'
import { execCall } from '..'

describe('call', () => {
  it('should execute to the correct result', done => {
    const c = call(x => x, 1)
    execCall(c, x => {
      assert(x === 1)
      done()
    })
  })
})
