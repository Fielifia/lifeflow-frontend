import { test, expect } from '@playwright/test'

test(
  'user completes workout and gets new personal best',
  async ({ page }) => {
    // ===== TEST USER =====

    const email = `test${Date.now()}@test.com`

    const password = '12345678'

    // ===== OPEN APP =====

    await page.goto('/')

    // ===== OPEN REGISTER =====

    await page
      .getByText(/create account/i)
      .click()

    // ===== REGISTER =====

    await page
      .getByPlaceholder(/email/i)
      .fill(email)

    await page
      .getByPlaceholder(/username/i)
      .fill('playwright-user')

    await page
      .getByPlaceholder(/^password$/i)
      .fill(password)

    await page
      .getByPlaceholder(/confirm password/i)
      .fill(password)

    await page
      .getByRole('button', {
        name: /create account/i,
      })
      .click()

    // ===== VERIFY DASHBOARD =====

    await expect(page).toHaveURL(
      'http://localhost:3000/',
    )

    // ===== GO TO WORKOUT PAGE =====

    await page.locator('.navbar').getByText('Workout').click()

    // ===== START EMPTY WORKOUT =====

    await page
      .getByRole('button', {
        name: /start empty workout/i,
      })
      .click()

    // ===== VERIFY WORKOUT PAGE =====

    await expect(page).toHaveURL(
      /workouts\/current\/run/i,
    )

    // ===== ADD EXERCISE =====

    await page
      .getByRole('button', {
        name: /add exercise/i,
      })
      .click()

    await page
      .getByPlaceholder(/search exercises/i)
      .fill('bench press')

    await page
      .getByText(/^Bench Press - Powerlifting$/i)
      .click()

    await page.getByText(/^Add 1$/i).click()

    // ===== LOG SET =====

    await page.getByLabel(/weight/i).fill('105')

    await page.getByLabel(/reps/i).fill('5')

    // ===== COMPLETE SET =====

    await page
      .getByLabel(/complete/i)
      .click()

    // ===== FINISH WORKOUT =====

    await page
      .getByRole('button', {
        name: /finish & save/i,
      })
      .click()

    // ===== VERIFY PB =====

    await expect(
      page.getByText(/personal best/i),
    ).toBeVisible()

    // ===== VERIFY HISTORY =====

    await page.goto(
      'http://localhost:3000/history',
    )

    await expect(
      page.getByText(/bench press/i),
    ).toBeVisible()

    // ===== VERIFY STATS =====

    await page.goto(
      'http://localhost:3000/stats',
    )

    await expect(
      page.getByText(/personal best/i),
    ).toBeVisible()
  },
)
