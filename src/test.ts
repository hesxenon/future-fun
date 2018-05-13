import { Call, InOf, ResolveOf, OutOf, ExecCallback } from '..'

export function testCall<Instance extends Call> ({ fn, thisArg }: Instance, arg: InOf<Instance>, finish: ExecCallback<OutOf<Instance>>) {
  finish(fn.call(thisArg, arg))
}
