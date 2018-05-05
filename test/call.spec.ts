import { call } from "../src/call";
import { assert } from "chai";

const ident = (x: number) => x
const double = (x: number) => x * 2

describe('call', () => {
  it('should execute to the correct result', () => {
    assert(call(ident, 1).exec() === 1)
  })
})
