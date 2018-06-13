import { assert } from 'chai'
import { Call, flatMap, map, testCall } from '..'
import { double, ident, stringify } from './test.util'

describe('flatMap', () => {
  const doubleStringify = Call.of(double).pipe(map(stringify))
  const cstringify = Call.of(stringify)
  const conditional = flatMap((num: number) => num > 5 ? doubleStringify : cstringify)
  const c = Call.of(ident).pipe(conditional)

  it('should map to the value of a nested call', () => {
    assert(c(2) === '2')
    assert(c(10) === '20')
  })

  it('should be possible to test which call is going to be used', () => {
    assert(conditional.morphism(2) === cstringify)
    assert(conditional.morphism(10) === doubleStringify)
  })
})
