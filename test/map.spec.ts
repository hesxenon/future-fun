import { call } from "../src/call";
import { map } from "../src/map";
import { assert } from "chai";
import { ident, double } from "./test.util";

describe('map', () => {
  it('should execute so that B º A is satisfied', () => {
    const c = call(ident, 1).then(map(double))
    assert(c.exec() === 2)
  })
})
