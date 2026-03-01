import { test, expect } from '@playwright/test'

// Basic smoke test to ensure the consultation success page renders
// In a real checkout flow we would create a Stripe session and follow the redirect.
// For the MVP we simply navigate to the success page with a dummy session id.

test.describe('Apartment Finder', () => {
  test('renders thank-you page after successful checkout', async ({ page, baseURL }) => {
    const testSessionId = 'cs_test_dummy'
    await page.goto(`${baseURL}/consultation/success?session_id=${testSessionId}`)

    // Expect headline to be visible
    const heading = page.getByRole('heading', { name: /consultation booked successfully/i })
    await expect(heading).toBeVisible()

    // CTA to dashboard should be present
    const dashboardLink = page.getByRole('link', { name: /go to dashboard/i })
    await expect(dashboardLink).toBeVisible()
  })
})
