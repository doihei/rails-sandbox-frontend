import { test, expect } from '@playwright/test'
import { setupArticlesMocks } from '../helpers/articles-playwright'

test.beforeEach(async ({ context, page }) => {
  await setupArticlesMocks(context, page)
})

// ── 記事一覧ページ ─────────────────────────────────────
test('記事一覧ページ', async ({ page }) => {
  await page.goto('/articles')
  // テーブルが描画されるまで待つ（ローディングが消えるのを待つ）
  await page.waitForSelector('table')
  await expect(page).toHaveScreenshot('articles-list.png', { fullPage: true })
})

// ── 記事作成フォーム（初期状態）───────────────────────
test('記事作成フォーム', async ({ page }) => {
  await page.goto('/articles/new')
  await page.waitForSelector('form')
  await expect(page).toHaveScreenshot('articles-new.png', { fullPage: true })
})

// ── 記事作成フォーム（バリデーションエラー状態）────────
test('記事作成フォーム バリデーションエラー', async ({ page }) => {
  await page.goto('/articles/new')
  await page.waitForSelector('form')

  // 空送信でエラー状態を作る
  await page.click('button[type="submit"]')

  // aria-live コンテナにエラーが現れるのを待つ
  await page.waitForSelector('[role="alert"]')

  await expect(page).toHaveScreenshot('articles-new-validation-error.png', { fullPage: true })
})

// ── 記事詳細ページ（オーナー表示）───────────────────────
test('記事詳細ページ', async ({ page }) => {
  await page.goto('/articles/1')
  // 記事タイトルが表示されるまで待つ
  await page.waitForSelector('h1')
  await expect(page).toHaveScreenshot('articles-detail.png', { fullPage: true })
})
