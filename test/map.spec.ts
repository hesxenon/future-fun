import { assert } from 'chai'
import { Call, map } from '..'
import { double, ident } from './test.util'

describe('map', () => {
  it('should map the value of a ICallMonad', () => {
    const a = Call.of(ident)
    const b = a.pipe(map(double))
    assert(a(1) === 1)
    assert(b(1) === 2)
  })
})
