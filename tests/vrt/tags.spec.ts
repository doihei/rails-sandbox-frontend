import { test, expect } from '@playwright/test'
import { setupArticlesMocks } from '../helpers/articles-playwright'

test.beforeEach(async ({ context, page }) => {
  await setupArticlesMocks(context, page)
})

test('タグ一覧ページ', async ({ page }) => {
  await page.goto('/tags')
  await page.waitForSelector('a[href^="/tags/"]')
  await expect(page).toHaveScreenshot('tags-list.png', { fullPage: true })
})

test('タグ別記事一覧ページ', async ({ page }) => {
  await page.goto('/tags/t1')
  await page.waitForSelector('table')
  await expect(page).toHaveScreenshot('tags-detail.png', { fullPage: true })
})
