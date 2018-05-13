import { map, call, flatMap } from '..'
import { testCall } from '../src/test'
import { assert } from 'chai'

describe('testCall', () => {
  it('should not execute previous calls', done => {
    let firstCalled = false
    const c = call(x => {
      let firstCalled = true
      return x
    }, 1).pipe(map(x => x * 2))
    testCall(c, 2, () => {
      assert(!firstCalled)
      done()
    })
  })

  it('should execute the callchain for mapped calls', () => {
    let firstCalled = false
    const c = call(x => x, 1).pipe(flatMap(x => call(y => y * 2, x).pipe(map(y => y + ''))))
    assert(c.exec(2) === '4')
  })
})
