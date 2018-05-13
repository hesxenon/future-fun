import { call } from '../src/call'
import { assert } from 'chai'
import { execCall } from '..'

describe('call', () => {
  it('should execute to the correct result', () => {
    const c = call(x => x, 1)
    assert(execCall(c) === 1)
  })
})
