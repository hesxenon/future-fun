import { assert } from 'chai'
import { Call, map, aggregate } from '..'
import { ident, double } from './test.util'

describe('aggregate', () => {
  it('should make it possible to compose multiple operators into one', () => {
    const a = Call.of(ident)
    const quadruple = aggregate(
      map(double),
      map(double)
    )
    assert(a.pipe(quadruple)(1) === 4)
  })
})
