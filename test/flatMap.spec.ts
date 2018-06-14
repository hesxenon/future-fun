import { assert } from 'chai'
import { Call, flatMap, map } from '..'
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

  it('should be possible to map to any call with the same output and same root argument type', () => {
    const a = Call.of(ident).pipe(map(stringify)).pipe(map(str => parseInt(str, 2)))
    const b = Call.of(ident)
    const op = flatMap<number, number>(num => num > 1 ? a : b)
    const c = Call.of(ident).pipe(op)
  })
})
