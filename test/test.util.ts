export const double = (x: number) => x * 2

export const cscratch = (x: number, after: () => void) => () => {
  x--
  if (x === 0) {
    after()
  }
}
