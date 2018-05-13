import { call, map, execCall } from '..'
import { assert } from 'chai'
import { double } from './test.util'

describe('map', () => {
  it('should execute so that B º A is satisfied', () => {
    const c = call(x => x, 1).pipe(map(double))
    assert(execCall(c) === 2)
  })
})
