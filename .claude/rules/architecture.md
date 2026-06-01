## 技術スタック

| 技術 | 用途 |
|---|---|
| Next.js 16 (App Router) | フレームワーク |
| Apollo Client 4 | GraphQL クライアント |
| TypeScript | 型安全 |

## ディレクトリ構成

```
app/                    # Next.js App Router（ページ・レイアウト）
components/             # UI コンポーネント
lib/
  apollo-client.ts      # Apollo Client 初期設定
  queries/              # GraphQL クエリ定義（gql タグ）
```

## Apollo Client

- React hooks（useQuery 等）は `@apollo/client/react` からインポートする（v4 で分離）
- GraphQL エンドポイント: `http://localhost:8080/graphql`
