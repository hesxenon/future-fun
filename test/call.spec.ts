import { call } from '../src/call'
import { assert } from 'chai'
import { execCall, map, flatMap } from '..'

describe('call', () => {
  it('should execute to the correct result', () => {
    const c = call(x => x, 1)
    assert(execCall(c) === 1)
  })

  describe('exec', () => {
    it('should not execute previous calls', () => {
      let firstCalled = false
      const c = call(x => {
        let firstCalled = true
        return x
      }, 1).pipe(map(x => x * 2))
      c.exec(2)
      assert(!firstCalled)
    })

    it('should execute the callchain for mapped calls', () => {
      const c = call(x => x, 1).pipe(flatMap(x => call(y => y * 2, x).pipe(map(y => y + ''))))
      assert(c.exec(2).resolve === '4')
    })

    it('should be able to extract the non-resolved result', () => {
      const apiCall = (x: number) => x + ''
      const c = call(x => x, 1).pipe(flatMap(x => call(apiCall, x)))
      assert(c.exec(2).out.fn === apiCall)
    })
  })
})
