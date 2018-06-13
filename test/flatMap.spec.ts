import { assert } from 'chai'
import { Call, flatMap } from '..'
import { double, ident } from './test.util'

describe('flatMap', () => {
  const unit = Call.of(ident)
  it('should map to the value of a nested call', () => {
    const b = unit.pipe(flatMap((resul: number) => Call.of(double)))
    assert(b(1) === 2)
  })
})
