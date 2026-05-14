import { mapWorkoutToTemplate } from '../../features/template/utils/mapWorkoutToTemplate'

describe('mapWorkoutToTemplate', () => {
  test('maps workout exercises into template format', () => {
    const workout = {
      name: 'Push Day',
      exercises: [
        {
          id: '1',
          name: 'Bench Press',
          sets: [{ reps: 10, weight: 50 }],
        },
      ],
    }

    const template = mapWorkoutToTemplate(workout)

    expect(template.exercises).toHaveLength(1)
    expect(template.exercises[0].name).toBe('Bench Press')
  })

  test('preserves set data when mapping', () => {
    const workout = {
      exercises: [
        {
          sets: [
            { reps: 8, weight: 80 },
          ],
        },
      ],
    }

    const template = mapWorkoutToTemplate(workout)

    expect(template.exercises[0].sets[0].reps).toBe(8)
    expect(template.exercises[0].sets[0].weight).toBe(80)
  })
})
