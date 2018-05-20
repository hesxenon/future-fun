import { Call } from '..'
import { ident, increment, stringify } from './test.util'
import { assert } from 'chai'
import { testCall } from '../src/test'

describe('flatMap', () => {
  it('should be possible to test whether the correct call is mapped to', () => {
    const a = Call.of(ident).map(x => x > 10 ? Call.of(stringify) : Call.of(increment))
  })
})
