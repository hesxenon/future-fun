import { call } from "../src/call";
import { assert } from "chai";
import { ident } from "./test.util";


describe('call', () => {
  it('should execute to the correct result', () => {
    assert(call(ident, 1).exec() === 1)
  })
})
