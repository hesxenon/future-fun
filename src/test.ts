import { Call, InOf, ResolveOf, OutOf, ExecCallback } from '..'

export function testCall<Instance extends Call> (call: Instance, arg: InOf<Instance>, finish: ExecCallback<{ out: OutOf<Instance>, resolve: ResolveOf<Instance> }>) {
  call.exec(arg, resolve => {
    finish({ resolve, out: call.fn.call(call.thisArg, arg) })
  })
}
