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

  test('preserves completed set values', () => {
    const workout = {
      exercises: [
        {
          sets: [
            {
              completed: true,
              reps: 8,
              weight: 100,
            },
          ],
        },
      ],
    }

    const cleaned = cleanWorkoutForSave(workout)

    expect(cleaned[0].sets[0]).toEqual({
      completed: true,
      reps: 8,
      weight: 100,
    })
  })

  test('handles multiple exercises correctly', () => {
    const workout = {
      exercises: [
        {
          name: 'Bench Press',
          sets: [
            { completed: true, reps: 10, weight: 50 },
          ],
        },
        {
          name: 'Squat',
          sets: [
            { completed: false, reps: 5, weight: 100 },
          ],
        },
      ],
    }

    const cleaned = cleanWorkoutForSave(workout)

    expect(cleaned).toHaveLength(1)
    expect(cleaned[0].name).toBe('Bench Press')
  })
})
