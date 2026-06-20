import http from 'node:http'

// a11y テスト用の最小限 GraphQL モックサーバー（CI 環境専用）
// proxy.ts はトークンの存在のみ確認するため、フェイクトークンで認証ガードを通過できる

const FAKE_TOKEN = 'fake-jwt-token-for-a11y-testing'

const resolvers = {
  createSession: () => ({
    data: {
      createSession: {
        token: FAKE_TOKEN,
        errors: [],
      },
    },
  }),

  GetArticles: () => ({
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
  }),

  GetArticle: () => ({
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
  }),
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  let body = ''
  req.on('data', (chunk) => (body += chunk))
  req.on('end', () => {
    try {
      const { query } = JSON.parse(body)
      const match = query.match(/(?:query|mutation)\s+(\w+)/)
      const operationName = match?.[1]

      const resolver = operationName && resolvers[operationName]
      res.writeHead(200)
      res.end(JSON.stringify(resolver ? resolver() : { data: {} }))
    } catch {
      res.writeHead(400)
      res.end(JSON.stringify({ errors: [{ message: 'Bad request' }] }))
    }
  })
})

server.listen(8080, () => {
  console.log('Mock GraphQL server listening on http://localhost:8080/graphql')
})
