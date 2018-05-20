import { assert } from 'chai'
import { Call, mapPromise } from '..'
import { double, ident } from './test.util'

describe('mapPromise', () => {
  const unit = Call.of(ident)
  it('should map the resolved value of a promise a promise that resolves with the mapped value', (done) => {
    const a = Call.of((result: number) => Promise.resolve(result)).pipe(mapPromise(double))
    a.with(1).exec().then(resolved => {
      assert(resolved === 2)
      done()
    })
  })
})
