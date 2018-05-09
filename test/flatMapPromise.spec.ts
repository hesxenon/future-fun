import { call } from '../src/call'
import { map, flatMapPromise, execCall, testCall } from '..'
import { assert } from 'chai'
import * as fs from 'fs'
import { cscratch } from './test.util'

describe('flatPromise', () => {
  it('should directly map to the result of a promise', done => {
    const c = call(x => x, 1)
      .pipe(flatMapPromise(x => Promise.resolve(x + '')))

    execCall(c, result => {
      assert(result === '1')
      done()
    })
  })

  it('should be possible to test mapped calls with different parameters', done => {
    const c = call(x => x, Promise.resolve(1))
      .pipe(flatMapPromise(x => x))

    const scratch = cscratch(2, done)

    testCall(c, Promise.resolve(2), ({ resolve }) => {
      assert(resolve === 2)
      scratch()
    })

    execCall(c, num => {
      assert(num === 1)
      scratch()
    })
  })
})
