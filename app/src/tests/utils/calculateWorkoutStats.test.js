import { calculateWorkoutStats }
  from '../../shared/utils/calculateWorkoutStats'

describe('calculateWorkoutStats', () => {
  test('calculates total sets', () => {
    const workout = {
      exercises: [
        {
          sets: [
            { reps: 10, weight: 50 },
            { reps: 8, weight: 60 },
          ],
        },
        {
          sets: [
            { reps: 5, weight: 100 },
          ],
        },
      ],
    }

    const stats =
      calculateWorkoutStats(workout)

    expect(stats.totalSets).toBe(3)
  })

  test('calculates total reps', () => {
    const workout = {
      exercises: [
        {
          sets: [
            { reps: 10, weight: 50 },
            { reps: 8, weight: 60 },
          ],
        },
      ],
    }

    const stats =
      calculateWorkoutStats(workout)

    expect(stats.totalReps).toBe(18)
  })

  test('calculates total volume', () => {
    const workout = {
      exercises: [
        {
          sets: [
            { reps: 10, weight: 50 },
            { reps: 8, weight: 60 },
          ],
        },
      ],
    }

    const stats =
      calculateWorkoutStats(workout)

    expect(stats.totalVolume).toBe(980)
  })

  test('returns personal best count', () => {
    const workout = {
      exercises: [],
      personalBests: 3,
    }

    const stats =
      calculateWorkoutStats(workout)

    expect(stats.personalBests).toBe(3)
  })

  test('returns workout duration', () => {
    const workout = {
      exercises: [],
      duration: 3600,
    }

    const stats =
      calculateWorkoutStats(workout)

    expect(stats.duration).toBe(3600)
  })

  test('returns zero values for invalid workout', () => {
    const stats =
      calculateWorkoutStats(null)

    expect(stats).toEqual({
      totalSets: 0,
      totalReps: 0,
      totalVolume: 0,
      personalBests: 0,
      duration: 0,
      exerciseCount: 0,
      muscleSplit: [],
    })
  })

  test('handles string values safely', () => {
    const workout = {
      exercises: [
        {
          sets: [
            {
              reps: '10',
              weight: '50',
            },
          ],
        },
      ],
    }

    const stats =
      calculateWorkoutStats(workout)

    expect(stats.totalReps).toBe(10)
    expect(stats.totalVolume).toBe(500)
  })
})
