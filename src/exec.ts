import { Call, ExecCallback, ResolveOf } from '..'

export function execCall<Instance extends Call> (call: Instance, done: ExecCallback<ResolveOf<Instance>>) {
  if (!call.previous) {
    done(call.fn(call.arg))
  } else {
    execCall(call.previous, previousResult => {
      call.exec(previousResult, done)
    })
  }
}
