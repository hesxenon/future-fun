import { call } from "../src/call";
import { ident, double } from "./test.util";
import { flatPromise } from "../src/flatPromise";
import { map } from "..";
import { assert } from "chai";

describe('flatPromise', () => {
  it('should directly map to the result of a promise', done => {
    const c = call(ident, 1).pipe(flatPromise(x => Promise.resolve(x + '')))
    c.then(result => {
      assert(result === '1')
      done()
    })
  })
})
