import { call } from '../src/call'
import { ident } from './test.util'
import { asyncFlatmap } from '../src/flatMapPromise'
import { Finish, map } from '..'
import { assert } from 'chai'
import * as fs from 'fs'

describe('flatPromise', () => {
  it('should directly map to the result of a promise', done => {
    const c = call(x => x, 1)
      .pipe(asyncFlatmap(x => Promise.resolve(x + '')))

    c.then(result => {
      assert(result === '1')
      done()
    })
  })

  it('should be possible to test mapped calls with different parameters', done => {
    const [assert2, assert1] = proxec(done, (x: number) => assert(x === 2), (x: number) => assert(x === 1))
    const c = call(x => x, Promise.resolve(1))
      .pipe(asyncFlatmap(x => x))

    c.exec(Promise.resolve(2), assert2)

    c.then(assert1)
  })
})

function proxec (after: Function, ...cbs: Function[]) {
  const exec = (cb: Function) => (...args: any[]) => {
    cb(...args)
    cbs.splice(cbs.indexOf(cb), 1)
    if (cbs.length === 0) {
      after()
    }
  }
  return cbs.map(exec)
}
