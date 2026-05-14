import { cleanWorkoutForSave } from '../../features/workout/utils/cleanWorkoutForSave'

describe('cleanWorkoutForSave', () => {
  test('removes incomplete sets', () => {
    const workout = {
      exercises: [
        {
          sets: [
            { completed: false, reps: '', weight: '' },
            { completed: true, reps: 10, weight: 50 },
          ],
        },
      ],
    }

    const cleaned = cleanWorkoutForSave(workout)

    expect(cleaned[0].sets).toHaveLength(1)
  })

  test('removes exercises with no completed sets', () => {
    const workout = {
      exercises: [
        {
          name: 'Bench Press',
          sets: [
            { completed: false },
            { completed: false },
          ],
        },
      ],
    }

    const cleaned = cleanWorkoutForSave(workout)

    expect(cleaned).toHaveLength(0)
  })

  test('maps restTime to rest', () => {
    const workout = {
      exercises: [
        {
          restTime: 90,
          sets: [{ completed: true }],
        },
      ],
    }

    const cleaned = cleanWorkoutForSave(workout)

    expect(cleaned[0].rest).toBe(90)
  })
})
