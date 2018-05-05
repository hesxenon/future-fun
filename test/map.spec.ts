import { call } from "../src/call";
import { map } from "../src/map";
import { assert } from "chai";

const ident = (x: number) => x
const double = (x: number) => x * 2

describe('map', () => {
  it('should execute so that B º A is satisfied', () => {
    const c = call(ident, 1).then(map(double))
    assert(c.exec() === 2)
  })
})
