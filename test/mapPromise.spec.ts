import { assert } from 'chai'
import { Call, mapPromise } from '..'
import { double, ident } from './test.util'

describe('mapPromise', () => {
  const unit = Call.of(ident)
  it('should map the resolved value of a promise a promise that resolves with the mapped value', (done) => {
    const a = Call.of((result: number) => Promise.resolve(result)).pipe(mapPromise(double))
    a(1).then(resolved => {
      assert(resolved === 2)
      done()
    })
  })

  it('should map to the resolved value of a nested promise', (done) => {
    const a = Call.of((result: number) => Promise.resolve(result)).pipe(mapPromise((x: number) => Promise.resolve(Promise.resolve(x))))
    a(1).then(resolved => {
      assert(resolved === 1)
      done()
    })
  })
})
