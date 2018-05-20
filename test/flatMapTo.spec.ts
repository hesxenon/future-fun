import { assert } from 'chai'
import { Call, flatMapTo } from '..'
import { double, ident } from './test.util'

describe('flatMapTo', () => {
  it('should map to the value of a nested call', () => {
    const a = Call.of(ident)
    const b = a.pipe(flatMapTo(Call.of(double)))
    assert(b.with(1).exec() === 2)
  })
})
