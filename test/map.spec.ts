import { Call, map } from '..'
import { ident, double } from './test.util'
import { assert } from 'chai'

describe('map', () => {
  it('should map the value of a ICallMonad', () => {
    const a = Call.of(ident)
    const b = a.pipe(map(double))
    assert(a.with(1).exec() === 1)
    assert(b.with(1).exec() === 2)
  })
})
