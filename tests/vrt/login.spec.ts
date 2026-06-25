import { test, expect } from '@playwright/test'
import { setupArticlesMocks } from '../helpers/articles-playwright'

test.beforeEach(async ({ context, page }) => {
  await setupArticlesMocks(context, page)
})

test('ログインページ', async ({ page }) => {
  // ログインページは Cookie なしでアクセスする（認証不要ページ）
  // beforeEach で Cookie を注入しているが、/login は認証ガードがないので問題なし
  await page.goto('/login')
  await page.waitForSelector('form')
  await expect(page).toHaveScreenshot('login.png', { fullPage: true })
})
