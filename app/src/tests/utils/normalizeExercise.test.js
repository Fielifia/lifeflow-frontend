import { normalizeExercise } from '../../features/exercise/utils/exerciseAdapter'

describe('normalizeExercise', () => {
  test('maps exercise api response correctly', () => {
    const raw = {
      _id: '1',
      name: 'bench press',
      bodyPart: 'chest',
      target: 'pectorals',
      equipment: 'barbell',
    }

    const result = normalizeExercise(raw)

    expect(result).toEqual({
      id: '1',
      name: 'Bench Press',
      bodyPart: 'Chest',
      muscle: 'Mid Chest',
      category: 'Strength',
      equipment: 'Barbell',
      image: '/placeholder.png',
      images: [],
      instructions: [],
    })
  })

  test('falls back to placeholder image', () => {
    const raw = {
      _id: '1',
      name: 'push up',
      bodyPart: 'chest',
      target: 'pectorals',
      equipment: 'body only',
    }

    const result = normalizeExercise(raw)

    expect(result.image).toBe('/placeholder.png')
  })

  test('detects mobility exercises', () => {
    const raw = {
      _id: '1',
      name: 'hamstring stretch',
      bodyPart: 'upper legs',
      target: 'hamstrings',
      equipment: 'body only',
    }

    const result = normalizeExercise(raw)

    expect(result.category).toBe('Mobility')
  })
})
