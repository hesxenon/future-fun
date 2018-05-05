import { call } from '../src/call'
import { ident } from './test.util'
import { asyncFlatmap } from '../src/asyncFlatmap'
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

  it('should not overwrite the function return type', done => {
    const c = call(x => x, Promise.resolve(1))
      .pipe(asyncFlatmap(x => x))
    c.fn(Promise.resolve(2))
    c.then(num => {
      assert(num === 1)
      done()
    })
  })
})
