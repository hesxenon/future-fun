import { map, Call } from '..'
import { double, ident } from './test.util'
import { assert } from 'chai'

describe('operators', () => {
  it('should simply wrap a morphism', () => {
    const odouble = map(double)
    assert(odouble.morphism === double)
  })

  it('should return a function that can transform one call into a new one', () => {
    const a = Call.of(ident)
    const b = map(double)(a)
    assert(a !== b)
    assert(b.previous === a)
  })
})
