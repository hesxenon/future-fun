import { aggregate, map } from '..'
import { Call } from '../src/call'
import { testCall } from '../src/test'
import { stringify } from './test.util'
import { assert } from 'chai'

describe('testing', () => {
  it('should be able to test each top-level part of a callchain', () => {
    const reduceLetters = aggregate(map((x: string) => x.split('')), map(chars => chars.reduce((all, val) => ({ ...all, [val]: val }), {} as any)))
    const call = Call.of(stringify).pipe(reduceLetters)
    assert(testCall(call, '2')['2'])
    assert(testCall(call, '2')['2'] === '2')
  })
})
