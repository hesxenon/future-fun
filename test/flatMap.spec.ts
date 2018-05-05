import { ident, double } from "./test.util";
import { call } from "../src/call";
import { flatMap } from "../src/flatMap";
import { assert } from "chai";

describe('flatMap', () => {
  it('should be able to pass on the result of a nested call', done => {
    const c = call(ident, 1).pipe(flatMap(x => call(double, x)))
    c.then(x => {
      assert(x === 2)
      done()
    })
  })
})
