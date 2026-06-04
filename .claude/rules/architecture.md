## 技術スタック

| 技術 | 用途 |
|---|---|
| Next.js 16 (App Router) | フレームワーク |
| Apollo Client 4 | GraphQL クライアント |
| TypeScript | 型安全 |
| graphql-codegen | GraphQL 型の自動生成 |
| smarthr-ui | UI コンポーネントライブラリ |
| styled-components | smarthr-ui の peer dependency |

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
- ページネーションのマージは `fetchMore` の `updateQuery` ではなく、`lib/apollo-client.ts` の `typePolicies` に `merge` 関数として定義する

## smarthr-ui

- CSS は `app/layout.tsx` で `import "smarthr-ui/smarthr-ui.css"` をインポートする
- `ThemeProvider`・`IntlProvider` は `components/Providers.tsx` でまとめて設定する
- Table は `<Table>` + ネイティブ `<thead>/<tbody>/<tr>` + `<Th>/<Td>` の組み合わせで使う（`TableHead` 等は存在しない）
