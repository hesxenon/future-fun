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

  it('should be possible to compose multiple operators into one', () => {
    const a = Call.of(ident)
    const quadruple = pipe(map((x: number) => {
      return x * 2
    }), map((x: number) => {
      return x * 2
    }))
    assert(a.pipe(quadruple).with(1).exec() === 4)
  })

  it('should be possible to access each operator of a piped chain', () => {
    const a = Call.of(ident)
    const odouble = map(double)
    const ostringify = map(stringify)
    const oparseInt = map(parseInt)

    const doubleStringify = pipe(odouble, ostringify, oparseInt)

    // test first operator
    assert(doubleStringify.last.previous.previous === odouble)

    // test second operator
    assert(doubleStringify.last.previous === ostringify)

    // test third operator
    assert(doubleStringify.last === oparseInt)
  })

  it('should create a new morphism as the composition of all inner morphisms', () => {
    const doubleStringify = pipe(map(double), map(stringify))
    assert(doubleStringify.morphism(1) === '2')
  })
})
