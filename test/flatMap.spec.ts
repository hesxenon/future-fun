import { assert } from 'chai'
import { Call, flatMap } from '..'
import { double, ident } from './test.util'

describe('flatMap', () => {
  it('should map to the value of a nested call', () => {
    const a = Call.of(ident)
    const b = a.pipe(flatMap(Call.of(double)))
    assert(b(1) === 2)
  })
})
