import { mapPreviousExercise } from '../../features/workout/utils/mapPreviousExercise'

describe('mapPreviousExercise', () => {
  test('maps previous sets correctly', () => {
    const res = {
      sets: [
        { reps: 10, weight: 50 },
      ],
      bestSet: { reps: 10, weight: 50 },
    }

    const result = mapPreviousExercise(res)

    expect(result.sets[0]).toEqual({
      reps: 10,
      weight: 50,
      completed: false,
    })
  })

  test('returns null if sets are missing', () => {
    expect(mapPreviousExercise(null)).toBeNull()
  })
})
