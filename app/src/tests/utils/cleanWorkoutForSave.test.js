import { cleanWorkoutForSave } from '../../features/workout/utils/cleanWorkoutForSave'

describe('cleanWorkoutForSave', () => {
  test('removes empty sets', () => {
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

  test('preserves workout notes', () => {
    const workout = {
      exercises: [
        {
          notes: 'Felt strong today',
          sets: [
            {
              completed: true,
              reps: 10,
              weight: 50,
            },
          ],
        },
      ],
    }

    const cleaned = cleanWorkoutForSave(workout)

    expect(cleaned[0].notes).toBe('Felt strong today')
  })
})
