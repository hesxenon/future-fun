import { assert } from 'chai'
import { Call, map } from '..'
import { double, ident } from './test.util'

describe('operators', () => {
  it('should simply wrap a morphism', () => {
    const odouble = map(double)
    assert(odouble.morphism === double)
  })

  it('should be able to transform a call into a new one', () => {
    const a = Call.of(ident)
    const b = map(double)(a)
    assert(a !== b)
    assert(b(1) === 2)
  })
})
