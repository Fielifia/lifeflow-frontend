import { calculateMuscleSplit } from '../../shared/utils/calculateMuscleSplit'

describe('calculateMuscleSplit', () => {
  test('calculates muscle split percentages', () => {
    const workout = {
      exercises: [
        {
          primaryMuscles: ['Chest'],
          sets: [{}, {}],
        },
        {
          primaryMuscles: ['Back'],
          sets: [{}],
        },
      ],
    }

    const result = calculateMuscleSplit(workout)

    expect(result).toEqual([
      {
        muscle: 'Chest',
        sets: 2,
        percentage: 67,
      },
      {
        muscle: 'Back',
        sets: 1,
        percentage: 33,
      },
    ])
  })

  test('returns empty array if workout is missing', () => {
    expect(calculateMuscleSplit()).toEqual([])
  })

  test('uses "Other" fallback for missing muscle group', () => {
    const workout = {
      exercises: [
        {
          sets: [{}],
        },
      ],
    }

    const result = calculateMuscleSplit(workout)

    expect(result[0].muscle).toBe('Other')
  })
})
