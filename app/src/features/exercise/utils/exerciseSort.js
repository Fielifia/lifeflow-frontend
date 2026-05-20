// /**
//  * Sorts exercises by selected sorting option.
//  * @param {Array<object>} exercises - Exercise list.
//  * @param {string} sort - Selected sorting option.
//  * @returns {Array<object>} Sorted exercises.
//  */
// export function sortExercises(exercises, sort) {
//   switch (sort) {
//   case 'z-a':
//     return [...exercises].sort((a, b) => b.name.localeCompare(a.name))

//   case 'a-z':
//   default:
//     return [...exercises].sort((a, b) => a.name.localeCompare(b.name))

//   case 'most-used':
//     // TODO: Sort by workout usage frequency
//     return [...exercises]

//   case 'recent':
//     // TODO: Sort by recently used in workouts
//     return [...exercises]
//   }
// }
