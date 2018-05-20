import { assert } from 'chai'
import { Call, map, mapPromise, pipe } from '..'
import { double, ident, stringify } from './test.util'

describe('piping', () => {
  it('should enable the user to provide custom mapping operators', (done) => {
    const a = Call.of((x: number) => Promise.resolve(x))

    const b = pipe(map<Promise<number>, Promise<number>>(x$ => x$.then(double)))
    const c = a.map(x$ => x$.then(double))
    const d = a.chain(Call.of((x: Promise<number>) => x.then(double)))

    const e = pipe(mapPromise(double))

    /**
     * a,c and d are equal, but once mapPromise is set-up it can be reused
     */
    Call.all(a, c, d).map(x$ => Promise.all(x$)).with([2, 1, 1]).exec().then((numbers) => {
      assert(numbers.every(num => num === 2))
      done()
    })
  })

  describe('pipe util', () => {
    it('should pipe multiple operators', () => {
      const a = Call.of(ident)
      const b = Call.of(stringify)
      const op1 = map(double)
      const op2 = map(stringify)
      const y = pipe(op1)(a)
      const quadrupleStringify = pipe(op1, op2)

      // assert(quadrupleStringify.morphism === stringify)
      // assert(quadrupleStringify.previous.morphism === double)
      // assert(quadrupleStringify.previous.previous.fn === ident)
      // assert(testCall(quadrupleStringify, 1) === '1')
      // assert(testCall(quadrupleStringify.previous, 1) === 2)
      // assert(quadrupleStringify.with(2).exec() === '5')
    })
  })
})
