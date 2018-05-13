import { Call, ExecCallback, ResolveOf } from '..'

export function execCall<Instance extends Call> (call: Instance): ResolveOf<Instance> {
  if (!call.previous) {
    return call.exec(call.arg)
  } else {
    return call.exec(execCall(call.previous))
  }
}
