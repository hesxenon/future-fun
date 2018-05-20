import { assert } from 'chai'
import { Call, flatMap } from '..'
import { double, ident, stringify } from './test.util'

describe('flatMap', () => {
  const unit = Call.of(ident)
  it('should map to the value of a nested call', () => {
    const b = unit.pipe(flatMap((resul: number) => Call.of(double)))
    assert(b.with(1) === 2)
  })

  it('should be possible to return any call', () => {
    const b = unit.pipe(flatMap((result: number) => result > 5 ? Call.of(stringify) : Call.of(double)))
    assert(b.with(1) === 2)
    assert(b.with(10) === '10')
  })
})
