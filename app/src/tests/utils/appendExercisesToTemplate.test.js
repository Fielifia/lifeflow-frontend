import { appendExercisesToTemplate } from '../../features/template/utils/appendExercisesToTemplate'

describe('appendExercisesToTemplate', () => {
  test('appends exercises instead of replacing existing ones', async () => {
    const selectedExercises = [
      {
        exerciseId: 'flyes',
        name: 'Chest Flyes',
      },
    ]

    let templateState = {
      name: 'Push Day',

      exercises: [
        {
          exerciseId: 'bench',
          name: 'Bench Press',
        },
      ],
    }

    const setTemplate = (updater) => {
      templateState = updater(templateState)
    }

    await appendExercisesToTemplate({
      exercises: selectedExercises,
      setTemplate,
    })

    expect(templateState.exercises).toHaveLength(2)

    expect(
      templateState.exercises.map(
        (e) => e.exerciseId,
      ),
    ).toEqual(['bench', 'flyes'])
  })
})
