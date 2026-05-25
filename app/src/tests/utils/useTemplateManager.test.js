import { renderHook, waitFor } from '@testing-library/react'

import { useTemplateManager } from '../../features/template/hooks/useTemplateManager'

import { ConfirmProvider } from '../../shared/context/ConfirmContext'

import { getTemplateByIdApi } from '../../shared/api/templateApi'

import { useExerciseFlow } from '../../shared/context/ExerciseFlowContext'


global.structuredClone = (value) =>
  JSON.parse(JSON.stringify(value))

jest.mock(
  'react-router-dom',
  () => ({
    useLocation: () => ({
      pathname: '/templates/template-1/edit',
    }),
  }),
  { virtual: true },
)

jest.mock('../../shared/context/WorkoutContext', () => ({
  useWorkoutContext: () => ({
    setDraftTemplate: jest.fn(),
  }),
}))

jest.mock('../../shared/api/templateApi', () => ({
  getTemplateByIdApi: jest.fn(),
  updateTemplateApi: jest.fn(),
  createTemplateApi: jest.fn(),
  deleteTemplateApi: jest.fn(),
}))

jest.mock('../../shared/context/ExerciseFlowContext', () => ({
  useExerciseFlow: jest.fn(),
}))

const wrapper = ({ children }) => (
  <ConfirmProvider>
    {children}
  </ConfirmProvider>
)

describe('useTemplateManager', () => {
  test(
    'does not refetch template when editingTemplate already exists',
    async () => {
      const apiTemplate = {
        _id: 'template-1',

        name: 'Push Day',

        notes: '',

        exercises: [
          {
            exerciseId: 'bench',
            name: 'Bench Press',
          },
        ],
      }

      useExerciseFlow.mockImplementation(() => ({
        selectedExercises: [],

        setSelectedExercises: jest.fn(),

        editingTemplate: apiTemplate,

        setEditingTemplate: jest.fn(),
      }))

      const { result } = renderHook(
        () =>
          useTemplateManager(
            'template-1',
            jest.fn(),
          ),
        {
          wrapper,
        },
      )

      await waitFor(() => {
        expect(
          result.current.template,
        ).toBeTruthy()
      })

      expect(
        result.current.template.exercises,
      ).toHaveLength(1)

      expect(
        getTemplateByIdApi,
      ).not.toHaveBeenCalled()
    },
  )
})
