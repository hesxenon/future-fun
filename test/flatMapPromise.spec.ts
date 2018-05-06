import { call } from '../src/call'
import { Finish, map, flatMapPromise } from '..'
import { assert } from 'chai'
import * as fs from 'fs'

describe('flatPromise', () => {
  it('should directly map to the result of a promise', done => {
    const c = call(x => x, 1)
      .pipe(flatMapPromise(x => Promise.resolve(x + '')))

    c.exec(result => {
      assert(result === '1')
      done()
    })
  })

  it('should be possible to test mapped calls with different parameters', done => {
    const [assert2, assert1] = proxec(done, (x: number) => assert(x === 2), (x: number) => assert(x === 1))
    const c = call(x => x, Promise.resolve(1))
      .pipe(flatMapPromise(x => x))

    c.test(Promise.resolve(2), ({ resolve }) => {
      assert2(resolve)
    })

    c.exec(assert1)
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
