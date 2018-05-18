import { Call, UnaryFunction, ICallMonad, mapPromise } from '..'
import { IOperator } from '../src/types'
import { assert } from 'chai'

describe.only('piping', () => {
  it('should enable the user to provide custom mapping operators', (done) => {
    const c = Call.of((x: number) => Promise.resolve(x))
    const d = c.pipe(mapPromise(x => x * 2))

    d.with(2).then(x => {
      assert(x === 4)
      done()
    })
  })
})
