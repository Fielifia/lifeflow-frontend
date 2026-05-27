import { isPersonalBest }
  from '../../shared/utils/personalBest'

describe('isPersonalBest', () => {
  test(
    'returns true when weight is higher than previous best',
    () => {
      const set = {
        weight: 105,
        reps: 5,
        completed: true,
      }

      const previousBest = {
        weight: 100,
        reps: 5,
      }

      expect(
        isPersonalBest(set, previousBest),
      ).toBe(true)
    },
  )

  test(
    'returns true when weight is equal but reps are higher',
    () => {
      const set = {
        weight: 100,
        reps: 8,
        completed: true,
      }

      const previousBest = {
        weight: 100,
        reps: 6,
      }

      expect(
        isPersonalBest(set, previousBest),
      ).toBe(true)
    },
  )

  test(
    'returns false when weight and reps are equal',
    () => {
      const set = {
        weight: 100,
        reps: 6,
        completed: true,
      }

      const previousBest = {
        weight: 100,
        reps: 6,
      }

      expect(
        isPersonalBest(set, previousBest),
      ).toBe(false)
    },
  )

  test(
    'returns false when set is not completed',
    () => {
      const set = {
        weight: 120,
        reps: 10,
        completed: false,
      }

      const previousBest = {
        weight: 100,
        reps: 5,
      }

      expect(
        isPersonalBest(set, previousBest),
      ).toBe(false)
    },
  )

  test(
    'returns false when weight is lower',
    () => {
      const set = {
        weight: 90,
        reps: 12,
        completed: true,
      }

      const previousBest = {
        weight: 100,
        reps: 5,
      }

      expect(
        isPersonalBest(set, previousBest),
      ).toBe(false)
    },
  )
})
