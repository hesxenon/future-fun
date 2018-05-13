import { Call, ResolveOf } from '..'

export function execCall<Instance extends Call> (call: Instance): ResolveOf<Instance> {
  return (() => {
    if (!call.previous) {
      return call.exec(call.arg)
    } else {
      return call.exec(execCall(call.previous))
    }
  })().resolve
}
