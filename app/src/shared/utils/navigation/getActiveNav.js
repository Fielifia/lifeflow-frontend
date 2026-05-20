/**
 * Resolves which navbar tab should be active
 * based on current route path.
 *
 * Navigation groups:
 * - Home: dashboard
 * - Workout: workout flow, templates, exercises
 * - History: completed workout history and workout details
 * - Stats: statistics pages
 * @param {string} pathname - Current route pathname
 * @returns {'home' | 'workout' | 'history' | 'stats'} Active navbar key
 */
export function getActiveNav(pathname) {

  // ===== STATS =====

  if (pathname.startsWith('/stats')) {
    return 'stats'
  }

  // ===== HISTORY =====

  if (pathname.startsWith('/history')) {
    return 'history'
  }

  if (pathname.match(/^\/workouts\/[^/]+$/)) {
    return 'history'
  }

  // ===== WORKOUTS =====
  if (
    pathname.startsWith('/workouts') ||
    pathname.startsWith('/templates') ||
    pathname.startsWith('/exercises')
  ) {
    return 'workout'
  }

  // ===== HOME =====

  return 'home'
}
