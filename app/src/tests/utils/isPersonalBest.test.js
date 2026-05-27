import calculatePersonalBest from '../../src/utils/isPersonalBest.js'

describe('isPersonalBest', () => {
  test('returns true when current weight is higher than previous best', () => {
    expect(isPersonalBest(105, 100)).toBe(true)
  })

  test('returns false when current weight is equal to previous best', () => {
    expect(isPersonalBest(100, 100)).toBe(false)
  })

  test('returns false when current weight is lower than previous best', () => {
    expect(isPersonalBest(95, 100)).toBe(false)
  })

  test('returns true if no previous best exists', () => {
    expect(isPersonalBest(60, null)).toBe(true)
  })

  test('handles invalid values safely', () => {
    expect(isPersonalBest(undefined, 100)).toBe(false)
    expect(isPersonalBest('abc', 100)).toBe(false)
  })
})
