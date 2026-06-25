import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { setupArticlesMocks } from '../helpers/articles-playwright'

test.beforeEach(async ({ context, page }) => {
  await setupArticlesMocks(context, page)
})

test.describe('ホームページ a11y', () => {
  test('WCAG 2.1 AA 違反がないこと', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('table')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
