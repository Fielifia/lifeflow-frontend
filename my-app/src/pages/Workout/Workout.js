// import { useLocation, useNavigate } from 'react-router-dom'

// import { useWorkoutLogic } from './hooks/useWorkoutLogic'

// import BackButton from '../../components/ui/BackButton'
// import RestTimer from './components/RestTimer'
// import ExerciseItem from './components/editor/ExerciseItem'
// import WorkoutControls from './components/editor/WorkoutControls'
// import WorkoutHeader from './components/editor/WorkoutHeader'

// /**
//  * Workout page for creating and tracking a workout session.
//  *
//  * Handles rendering only. All logic is managed in useWorkoutLogic.
//  * @returns {import('react').ReactElement} Workout page UI
//  */
// export default function Workout() {
//   const navigate = useNavigate()
//   const location = useLocation()

//   const {
//     workout,
//     saving,
//     success,
//     error,

//     status,
//     elapsed,

//     restTime,
//     setRestTime,
//     restRemaining,
//     isResting,
//     skipRest,

//     customName,
//     setCustomName,
//     isEditingName,
//     setIsEditingName,

//     handleStartPause,
//     adjustRest,

//     openLibrary,
//     addSet,
//     updateSet,
//     removeExercise,
//     removeSet,
//     toggleSetComplete,
//     updateWorkoutNotes,

//     saveWorkout,
//   } = useWorkoutLogic(navigate, location)

//   const title = customName || 'Workout'

//   return (
//     <div className="card-base card-workout">
//       <BackButton />
//       {/* HEADER */}
//       <WorkoutHeader
//         title={title}
//         isEditing={isEditingName}
//         setIsEditing={setIsEditingName}
//         customName={customName}
//         setCustomName={setCustomName}
//         elapsed={elapsed}
//       />

//       {/* TOP CONTROLS */}
//       <WorkoutControls
//         status={status}
//         handleStartPause={handleStartPause}
//         saveWorkout={saveWorkout}
//         saving={saving}
//         hasExercises={workout.exercises.length > 0}
//       />

//       {/* REST TIMER */}
//       <RestTimer
//         isResting={isResting}
//         restRemaining={restRemaining}
//         adjustRest={adjustRest}
//         skipRest={skipRest}
//       />

//       {/* ADD EXERCISE */}
//       <button className="btn btn-secondary btn-full" onClick={openLibrary}>
//         Add exercise
//       </button>

//       {/* EXERCISES */}
//       {workout.exercises.map((ex, i) => (
//         <ExerciseItem
//           key={ex.exerciseId}
//           ex={ex}
//           i={i}
//           navigate={navigate}
//           addSet={addSet}
//           updateSet={updateSet}
//           removeExercise={removeExercise}
//           removeSet={removeSet}
//           toggleSetComplete={toggleSetComplete}
//           restTime={restTime}
//           setRestTime={setRestTime}
//         />
//       ))}

//       {/* NOTES */}
//       <textarea
//         className="input-base textarea"
//         value={workout.notes}
//         placeholder="Notes..."
//         onChange={(e) => updateWorkoutNotes(e.target.value)}
//       />

//       {/* BOTTOM CONTROLS */}
//       {workout.exercises.length > 0 && (
//         <WorkoutControls
//           status={status}
//           handleStartPause={handleStartPause}
//           saveWorkout={saveWorkout}
//           saving={saving}
//           hasExercises={true}
//         />
//       )}

//       {/* FEEDBACK */}
//       {success && <p className="muted center">Workout saved ✔</p>}
//       {error && <p className="error center">{error}</p>}
//     </div>
//   )
// }
