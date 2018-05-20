import { Call, flatMap } from '..'
import { ident, double, stringify } from './test.util'
import { assert } from 'chai'

describe('flatMap', () => {
  const unit = Call.of(ident)
  it('should map to the value of a nested call', () => {
    const b = unit.pipe(flatMap((resul: number) => Call.of(double)))
    assert(b.with(1).exec() === 2)
  })

  it('should be possible to return any call', () => {
    const b = unit.pipe(flatMap((result: number) => result > 5 ? Call.of(stringify) : Call.of(double)))
    assert(b.with(1).exec() === 2)
    assert(b.with(10).exec() === '10')
  })
})
