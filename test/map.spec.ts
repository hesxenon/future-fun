import { assert } from 'chai'
import { Call, map } from '..'
import { double, ident } from './test.util'

describe('map', () => {
  it('should map the value of a ICallMonad', () => {
    const a = Call.of(ident)
    const b = a.pipe(map(double))
    assert(a.with(1).exec() === 1)
    assert(b.with(1).exec() === 2)
  })
})
