import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const MOCK_ARTICLES = {
  data: {
    articles: {
      nodes: [
        {
          id: '1',
          title: 'テスト記事',
          body: 'テスト本文',
          status: 'published',
          createdAt: '2024-01-01T00:00:00Z',
          user: { name: 'テストユーザー', email: 'test@example.com' },
          tags: [],
        },
      ],
      pageInfo: { hasNextPage: false, endCursor: null },
    },
  },
}

const MOCK_ARTICLE = {
  data: {
    article: {
      id: '1',
      title: 'テスト記事',
      body: 'テスト本文',
      status: 'published',
      lockVersion: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      user: { id: '1', name: 'テストユーザー', email: 'test@example.com' },
      tags: [],
    },
    me: { id: '1' },
  },
}

const MOCKS: Record<string, unknown> = {
  GetArticles: MOCK_ARTICLES,
  GetArticle: MOCK_ARTICLE,
}

test.beforeEach(async ({ context, page }) => {
  // ログインフォームを経由せず Cookie を直接注入して認証ガードを通過する
  // proxy.ts は jwt_token Cookie の有無のみ確認するためフェイク値で十分
  await context.addCookies([
    {
      name: 'jwt_token',
      value: 'fake-jwt-for-a11y-testing',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
    },
  ])

  // ブラウザ→バックエンドの GraphQL 通信をインターセプト（Apollo Client が対象）
  // operationName が未定義のリクエストは空データを返す
  await page.route('**/graphql', async (route) => {
    const body = JSON.parse(route.request().postData() ?? '{}')
    const mock = MOCKS[body.operationName]
    await route.fulfill({ json: mock ?? { data: {} } })
  })
})

test.describe('記事一覧 a11y', () => {
  test('WCAG 2.1 AA 違反がないこと', async ({ page }) => {
    await page.goto('/articles')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})

test.describe('記事フォーム a11y', () => {
  test('新規作成フォームに違反がないこと', async ({ page }) => {
    await page.goto('/articles/new')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('バリデーションエラー時も違反がないこと', async ({ page }) => {
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
    await page.goto('/articles/1')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
