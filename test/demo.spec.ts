import { fail } from 'assert'
import { assert } from 'chai'
import { Call } from '..'
import { double, ident, stringify } from './test.util'
import { testCall } from '../src/test'

describe('demo', () => {

  it('should be possible to test an unpiped call', () => {
    const a = Call.of(double)
    assert(testCall(a, 1) === 2)
  })

  it('should fetch list of user and aggregate avatar ', () => {
    const str = 'dan'
    const fetchDb = Call.of((_: undefined) => {
      fail('the real fetchDb function should never be called since we\'re testing with a fake call!')
      return Promise.resolve(mockUser)
    })

    const fetchAvatar = Call.of(({ id }: IUser) => {
      fail('the real fetchAvatar function should never be called since we\'re testing with a fake call!')
      return Promise.resolve('b64://img/' + id)
    })

    const fetchAndFilter = (filter: string) => fetchDb.map(x$ => x$.then((users) => {
      return users.filter(({ name }) => name.startsWith(filter))
        .map(u => fetchAvatar
          .map(av$ => av$.then((avatar) => {
            return u.name + avatar
          })))
    }))
    const c = fetchAndFilter(str)
    const countOfExpectedCalls = mockUser.filter(({ name }) => name.startsWith(str)).length

    testCall(c, Promise.resolve(mockUser))
      .then(avatarCalls => {
        assert(avatarCalls.length === countOfExpectedCalls)
      })
  })

  it('should not execute the previous calls', () => {
    const c = Call.of((x: number) => {
      fail('this should not be called!')
      return x
    }).map(double)
    assert(testCall(c, 2) === 4)
  })

  it('should return the chained call', () => {
    const c = Call.of(ident).chain(Call.of(double))
    assert(testCall(c, 1).with(1).exec() === 2)
    assert(testCall(c, 1).fn === double)
  })

  it('should directly return the result of the mapped call', () => {
    const c = Call.of(ident).map(stringify)
    assert(testCall(c, 3) === '3')
  })

  it('should be possible to test the callchain of a nested call', () => {
    const doubleString = Call.of(double).map(stringify)
    const c = Call.of(ident).chain(doubleString)
    const chainedCall = c.morphism()
    assert(chainedCall === doubleString)
    assert(chainedCall.morphism === stringify)
    assert(chainedCall.previous.fn === double)
  })

  describe('test save', () => {
    const storage = {} as any
    function save (num: number) {
      const id = Object.keys(storage).length
      storage[id] = num
      return Promise.resolve({ id, num })
    }
    it('should setup calls without executing anything', () => {
      function failOnSave (num: number) {
        fail('this should not be called')
        return save(num)
      }
      const doubleAndSave = Call.of(double).chain(Call.of(failOnSave))
    })

    it('should be possible to test the response of save seperately', () => {
      const saveAndReturnId = Call.of(double)
        .chain(Call.of(save))
        .map(res$ => res$.then(res => res.id))

      // test a mocked response
      testCall(saveAndReturnId, Promise.resolve({ id: 1, num: 1 })).then(id => {
        assert(id === 1)
      })
    })

    it('should be possible to execute save normally', () => {
      const doubleAndSave = Call.of(double).chain(Call.of(save))
      const expectedId = Object.keys(storage).length
      doubleAndSave.with(2).exec().then(({ id, num }) => {
        assert(num === 4)
        assert(id === expectedId)
      })
    })
  })
})

interface IUser {
  id: number
  name: string
}

const mockUser: IUser[] = [{
  'id': 1,
  'name': 'Wylma'
}, {
  'id': 2,
  'name': 'Belita'
}, {
  'id': 3,
  'name': 'Giacopo'
}, {
  'id': 4,
  'name': 'Alyda'
}, {
  'id': 5,
  'name': 'Emmaline'
}, {
  'id': 6,
  'name': 'Jorie'
}, {
  'id': 7,
  'name': 'Irvine'
}, {
  'id': 8,
  'name': 'Carilyn'
}, {
  'id': 9,
  'name': 'Doralynn'
}, {
  'id': 10,
  'name': 'Alfred'
}, {
  'id': 11,
  'name': 'Aloin'
}, {
  'id': 12,
  'name': 'Merl'
}, {
  'id': 13,
  'name': 'Genevieve'
}, {
  'id': 14,
  'name': 'Karylin'
}, {
  'id': 15,
  'name': 'Ardine'
}, {
  'id': 16,
  'name': 'Mathias'
}, {
  'id': 17,
  'name': 'Maxy'
}, {
  'id': 18,
  'name': 'Marabel'
}, {
  'id': 19,
  'name': 'Fayette'
}, {
  'id': 20,
  'name': 'Stanislas'
}, {
  'id': 21,
  'name': 'Raynard'
}, {
  'id': 22,
  'name': 'Clo'
}, {
  'id': 23,
  'name': 'Joshua'
}, {
  'id': 24,
  'name': 'Bowie'
}, {
  'id': 25,
  'name': 'Nikolos'
}, {
  'id': 26,
  'name': 'Osbourn'
}, {
  'id': 27,
  'name': 'Forester'
}, {
  'id': 28,
  'name': 'Arleta'
}, {
  'id': 29,
  'name': 'Sonnie'
}, {
  'id': 30,
  'name': 'Breanne'
}, {
  'id': 31,
  'name': 'Georgia'
}, {
  'id': 32,
  'name': 'Celestine'
}, {
  'id': 33,
  'name': 'Thelma'
}, {
  'id': 34,
  'name': 'Antin'
}, {
  'id': 35,
  'name': 'Gabrielle'
}, {
  'id': 36,
  'name': 'Fraser'
}, {
  'id': 37,
  'name': 'Braden'
}, {
  'id': 38,
  'name': 'Ailsun'
}, {
  'id': 39,
  'name': 'Melesa'
}, {
  'id': 40,
  'name': 'Riccardo'
}, {
  'id': 41,
  'name': 'Simona'
}, {
  'id': 42,
  'name': 'Tildie'
}, {
  'id': 43,
  'name': 'Faustina'
}, {
  'id': 44,
  'name': 'Sylvan'
}, {
  'id': 45,
  'name': 'Merridie'
}, {
  'id': 46,
  'name': 'Eldin'
}, {
  'id': 47,
  'name': 'Maressa'
}, {
  'id': 48,
  'name': 'Ana'
}, {
  'id': 49,
  'name': 'Jodie'
}, {
  'id': 50,
  'name': 'Brendan'
}, {
  'id': 51,
  'name': 'Jephthah'
}, {
  'id': 52,
  'name': 'Stacee'
}, {
  'id': 53,
  'name': 'Berty'
}, {
  'id': 54,
  'name': 'Courtnay'
}, {
  'id': 55,
  'name': 'Myrwyn'
}, {
  'id': 56,
  'name': 'Leif'
}, {
  'id': 57,
  'name': 'Gregor'
}, {
  'id': 58,
  'name': 'Peta'
}, {
  'id': 59,
  'name': 'Courtney'
}, {
  'id': 60,
  'name': 'Clim'
}, {
  'id': 61,
  'name': 'Malinde'
}, {
  'id': 62,
  'name': 'Karissa'
}, {
  'id': 63,
  'name': 'Sarene'
}, {
  'id': 64,
  'name': 'Alissa'
}, {
  'id': 65,
  'name': 'Shannen'
}, {
  'id': 66,
  'name': 'Giavani'
}, {
  'id': 67,
  'name': 'Nicola'
}, {
  'id': 68,
  'name': 'Adey'
}, {
  'id': 69,
  'name': 'Shandee'
}, {
  'id': 70,
  'name': 'Karlens'
}, {
  'id': 71,
  'name': 'Sianna'
}, {
  'id': 72,
  'name': 'Joy'
}, {
  'id': 73,
  'name': 'Bartolomeo'
}, {
  'id': 74,
  'name': 'Theressa'
}, {
  'id': 75,
  'name': 'Lesley'
}, {
  'id': 76,
  'name': 'Ella'
}, {
  'id': 77,
  'name': 'Niki'
}, {
  'id': 78,
  'name': 'Sissy'
}, {
  'id': 79,
  'name': 'Cordi'
}, {
  'id': 80,
  'name': 'Alene'
}, {
  'id': 81,
  'name': 'Adamo'
}, {
  'id': 82,
  'name': 'Karen'
}, {
  'id': 83,
  'name': 'Kalil'
}, {
  'id': 84,
  'name': 'Dag'
}, {
  'id': 85,
  'name': 'Dov'
}, {
  'id': 86,
  'name': 'Antony'
}, {
  'id': 87,
  'name': 'Vasily'
}, {
  'id': 88,
  'name': 'Powell'
}, {
  'id': 89,
  'name': 'Ermentrude'
}, {
  'id': 90,
  'name': 'Bellanca'
}, {
  'id': 91,
  'name': 'Sosanna'
}, {
  'id': 92,
  'name': 'Pepi'
}, {
  'id': 93,
  'name': 'Cam'
}, {
  'id': 94,
  'name': 'Eolande'
}, {
  'id': 95,
  'name': 'Coralie'
}, {
  'id': 96,
  'name': 'Gregg'
}, {
  'id': 97,
  'name': 'Edvard'
}, {
  'id': 98,
  'name': 'Ashley'
}, {
  'id': 99,
  'name': 'Merl'
}, {
  'id': 100,
  'name': 'Othilia'
}]
