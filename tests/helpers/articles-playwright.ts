import type { BrowserContext, Page } from '@playwright/test'

export const MOCK_ARTICLES = {
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
          tags: [{ id: 't1', name: 'rails' }],
          comments: [
            { id: "c1", body: "コメント1", user: { name: null, email: "yamada@example.com" }},
            { id: "c2", body: "コメント2", user: { name: null, email: "yamada@example.com" }},
          ],
          commentsCount: 2,
        },
      ],
      pageInfo: { hasNextPage: false, endCursor: null },
    },
  },
}

export const MOCK_ARTICLE = {
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
      tags: [{ id: 't1', name: 'rails' }],
      comments: [
        { id: "c1", body: "コメント1", user: { name: null, email: "yamada@example.com" }},
        { id: "c2", body: "コメント2", user: { name: null, email: "yamada@example.com" }},
      ],
      commentsCount: 2,
    },
    me: { id: '1' },
  },
}

const MOCKS: Record<string, unknown> = {
  GetArticles: MOCK_ARTICLES,
  GetArticle: MOCK_ARTICLE,
}

/**
 * Playwright の Playwright テスト用共通セットアップ。
 * - jwt_token Cookie を注入して認証ガード（proxy.ts）を通過させる
 * - GraphQL リクエストをインターセプトし、operationName に対応したモックを返す
 */
export async function setupArticlesMocks(context: BrowserContext, page: Page): Promise<void> {
  await context.addCookies([
    {
      name: 'jwt_token',
      value: 'fake-jwt-for-testing',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
    },
  ])

  await page.route('**/graphql', async (route) => {
    const body = JSON.parse(route.request().postData() ?? '{}')
    const mock = MOCKS[body.operationName]
    await route.fulfill({ json: mock ?? { data: {} } })
  })
}
