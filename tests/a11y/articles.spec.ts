import { test, expect, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// ログインヘルパー（共通化）
async function login(page: Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'yamada@example.com')
  await page.fill('input[type="password"]', 'password')
  await page.click('button[type="submit"]')
  await page.waitForURL('/articles')
}

test.describe('記事一覧 a11y', () => {
  test('WCAG 2.1 AA 違反がないこと', async ({ page }) => {
    await login(page)
    await page.goto('/articles')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})

test.describe('記事フォーム a11y', () => {
  test('新規作成フォームに違反がないこと', async ({ page }) => {
    await login(page)
    await page.goto('/articles/new')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('バリデーションエラー時も違反がないこと', async ({ page }) => {
    await login(page)
    await page.goto('/articles/new')

    // 空送信でエラー状態を作る
    await page.click('button[type="submit"]')
    await page.waitForSelector('[role="alert"]')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})

test.describe('記事詳細 a11y', () => {
  test('違反がないこと', async ({ page }) => {
    await login(page)
    // 既存記事の id は環境に合わせて調整
    await page.goto('/articles/1')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
