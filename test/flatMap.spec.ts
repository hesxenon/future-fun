import { ident, double } from "./test.util";
import { call } from "../src/call";
import { flatMap } from "../src/flatMap";
import { assert } from "chai";

describe('flatMap', () => {
  it('should be able to pass on the result of a nested call', () => {
    const c = call(ident, 1).then(flatMap(x => call(double, x)))
    assert(c.exec() === 2)
  })
})
