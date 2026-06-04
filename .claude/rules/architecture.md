## 技術スタック

| 技術 | 用途 |
|---|---|
| Next.js 16 (App Router) | フレームワーク |
| Apollo Client 4 | GraphQL クライアント |
| TypeScript | 型安全 |
| graphql-codegen | GraphQL 型の自動生成 |

## ディレクトリ構成

```
app/                    # Next.js App Router（ページ・レイアウト）
components/             # UI コンポーネント
lib/
  apollo-client.ts      # Apollo Client 初期設定
  gql/                  # graphql-codegen が生成する型・gql タグ（自動生成）
  queries/              # GraphQL クエリ定義（gql タグは lib/gql からインポート）
```

## Apollo Client

- React hooks（useQuery 等）は `@apollo/client/react` からインポートする（v4 で分離）
- GraphQL エンドポイント: `http://localhost:8080/graphql`
- GraphQL クエリの型は `graphql-codegen`（`npm run codegen`）で自動生成し `lib/gql/` に出力する。手動型定義は書かない
