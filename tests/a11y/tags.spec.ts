import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { setupArticlesMocks } from '../helpers/articles-playwright'

test.beforeEach(async ({ context, page }) => {
  await setupArticlesMocks(context, page)
})

test.describe('タグ一覧 a11y', () => {
  test('WCAG 2.1 AA 違反がないこと', async ({ page }) => {
    await page.goto('/tags')
    await page.waitForSelector('a[href^="/tags/"]')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})

test.describe('タグ別記事一覧 a11y', () => {
  test('WCAG 2.1 AA 違反がないこと', async ({ page }) => {
    await page.goto('/tags/t1')
    await page.waitForSelector('table')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
