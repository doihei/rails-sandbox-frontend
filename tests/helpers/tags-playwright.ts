export const MOCK_TAGS = {
  data: {
    tags: {
      nodes: [
        { id: 't1', name: 'rails', articlesCount: 5 },
        { id: 't2', name: 'graphql', articlesCount: 3 },
      ],
      pageInfo: { hasNextPage: false, endCursor: null },
    },
  },
}

export const MOCK_TAGGED_ARTICLES = {
  data: {
    taggedArticles: {
      nodes: [
        {
          id: '1',
          title: 'テスト記事',
          status: 'published',
          createdAt: '2024-01-01T00:00:00Z',
          commentsCount: 2,
          likesCount: 3,
          likedByMe: true,
          user: { id: '2', name: 'テストユーザー', email: 'test@example.com' },
          tags: [{ id: 't1', name: 'rails' }],
        },
      ],
      pageInfo: { hasNextPage: false, endCursor: null },
    },
    me: { id: '1' },
  },
}
