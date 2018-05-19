import { Call, UnaryFunction, ICallMonad, mapPromise } from '..'
import { IOperator } from '../src/types'
import { assert } from 'chai'
import { ident, stringify, increment, double } from './test.util'
import { flatMap } from '../src/operators/flatMap'
import { testCall } from '../src/test'
import { map } from '../src/operators/map'
import { pipe } from '../src/operators/util'
import { flatMapTo } from '../src/operators/flatMapTo'

describe('piping', () => {
  it('should enable the user to provide custom mapping operators', (done) => {
    const a = Call.of((x: number) => Promise.resolve(x))

    const b = a.pipe(map(x$ => x$.then(double)))
    const c = a.map(x$ => x$.then(double))
    const d = a.chain(Call.of((x: Promise<number>) => x.then(double)))

    const e = a.pipe(mapPromise(double))

    /**
     * b,c,d and e are equal, but once mapPromise is set-up it can be reused
     */
    Call.all(b, c, d, e).map(x$ => Promise.all(x$)).with([1, 1, 1, 1]).exec().then((numbers) => {
      assert(numbers.every(num => num === 2))
      done()
    })
  })

  describe('flatMap', () => {
    it('should be possible to test whether the correct call is mapped to', () => {
      const a = Call.of(ident).pipe(flatMap(x => x > 10 ? Call.of(stringify) : Call.of(increment)))
      assert(a.operator.morphism(10).fn === increment)
      assert(testCall(a, 11) === '11')
      assert(testCall(a, 5) === 6)
    })
  })

  describe('pipe util', () => {
    it('should pipe multiple operators', () => {
      const a = Call.of(ident)
      const quadrupleStringify = pipe(a, map(double), map(double), flatMapTo(Call.of(stringify)))
      assert(testCall(quadrupleStringify, 1) === '4')
    })
  })
})
