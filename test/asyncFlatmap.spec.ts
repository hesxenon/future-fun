import { call } from "../src/call";
import { ident, double } from "./test.util";
import { asyncFlatmap } from "../src/flatPromise";
import { map, Finish } from "..";
import { assert } from "chai";
import * as fs from 'fs'

describe('flatPromise', () => {
  it('should directly map to the result of a promise', done => {
    const c = call(ident, 1).pipe(asyncFlatmap(x => Promise.resolve(x + ''), (promise) => promise.then))
    c.then(result => {
      assert(result === '1')
      done()
    })
  })

  it('should map directly to the result of a callback', done => {
    const c = call(ident, __filename).pipe(asyncFlatmap(path => {
      return (finish: Finish<fs.Stats>) => {
        fs.stat(path, (err, stats) => {
          if (err) throw err
          finish(stats)
        })
      }
    }))

    c.then(stats => {
      assert(stats.isFile())
      done()
    })
  })
})
