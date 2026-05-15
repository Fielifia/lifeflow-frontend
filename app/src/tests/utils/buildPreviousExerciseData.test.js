import { buildPreviousExerciseData } from '../../features/workout/utils/buildPreviousExerciseData'

describe('buildPreviousExerciseData', () => {
  test('maps previous sets correctly', () => {
    const res = {
      sets: [
        { reps: 10, weight: 50 },
      ],
      bestSet: { reps: 10, weight: 50 },
    }

    const result = buildPreviousExerciseData(res)

    expect(result.sets[0]).toEqual({
      reps: 10,
      weight: 50,
      completed: false,
    })
  })

  test('returns null if sets are missing', () => {
    expect(buildPreviousExerciseData(null)).toBeNull()
  })
})
