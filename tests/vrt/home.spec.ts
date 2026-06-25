import { test, expect } from '@playwright/test'
import { setupArticlesMocks } from '../helpers/articles-playwright'

test.beforeEach(async ({ context, page }) => {
  await setupArticlesMocks(context, page)
})

test('ホームページ', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('table')
  await expect(page).toHaveScreenshot('home.png', { fullPage: true })
})
