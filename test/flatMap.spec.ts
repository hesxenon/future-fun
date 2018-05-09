import { double, cscratch } from './test.util'
import { assert } from 'chai'
import { map, Call, call, flatMap, ResolveOf, InOf, InferredCall, execCall } from '..'
import { testCall } from '../src/test'

describe('flatMap', () => {
  it('should be able to pass on the result of a nested call', done => {
    const c = call(x => x, 1).pipe(flatMap(x => call(double, x)))
    execCall(c, x => {
      assert(x === 2)
      done()
    })
  })

  it('should be able to resolve mapped calls', done => {
    const apiCall = (x: number) => x + ''
    const parseResponse = parseInt

    const send = (x: number) => call(apiCall, x).pipe(map(parseResponse))

    const c = call(x => x, 1)
      .pipe(flatMap(send))

    testCall(c, 2, ({ out }) => {
      assert(out.previous.fn === apiCall)
    })

    execCall(c, x => {
      assert(x === 1)
      done()
    })
  })

  it('should be able to take different call signatures as long as they resolve to the same type', done => {
    const apiCall = (x: number) => Promise.resolve(x + '')
    const localCall = (x: number) => Promise.resolve(`local: ${x}`)
    const fetchRemote = (id: number) => call(apiCall, id).pipe(map(x$ => x$.then(x => `remote: ${x}`)))
    const fetchLocal = (id: number) => call(localCall, id)

    const scratch = cscratch(2, done)

    const c = call(x => x, 'remote')
      .pipe(flatMap(type => type === 'remote' ? fetchRemote(1) : fetchLocal(1)))

    testCall(c, 'remote', ({ out }) => {
      assert(out.previous)
      if (out.previous) {
        assert(out.previous.fn === apiCall)
      }
      scratch()
    })

    testCall(c, 'local', ({ out }) => {
      assert(out.fn === localCall)
      scratch()
    })
  })
})
