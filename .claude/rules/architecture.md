## 技術スタック

| 技術 | 用途 |
|---|---|
| Next.js 16 (App Router) | フレームワーク |
| Apollo Client 4 | GraphQL クライアント |
| TypeScript | 型安全 |
| graphql-codegen | GraphQL 型の自動生成 |
| smarthr-ui | UI コンポーネントライブラリ |
| styled-components | smarthr-ui の peer dependency |
| Vitest + Testing Library | ユニットテスト |
| react-hook-form + zod | フォームバリデーション |

## ディレクトリ構成

```
app/                    # Next.js App Router（ページ・レイアウト）
  login/                # ログインページ・Server Action
  articles/             # 記事一覧・詳細ページ
    [id]/               # 記事詳細ページ（表示・削除）
      edit/             # 記事編集ページ
    new/                # 記事新規作成ページ
components/             # UI コンポーネント
lib/
  apollo-client.ts      # Apollo Client 初期設定
  auth.ts               # JWT Cookie 管理ユーティリティ
  gql/                  # graphql-codegen が生成する型・gql タグ（自動生成）
  queries/              # GraphQL クエリ定義（gql タグは lib/gql からインポート）
proxy.ts                # 認証ガード（Next.js 16 proxy 規約）
tests/
  components/           # コンポーネントのテスト
```

## Apollo Client

- React hooks（useQuery 等）は `@apollo/client/react` からインポートする（v4 で分離）
- GraphQL エンドポイント: `http://localhost:8080/graphql`
- Apollo Client は `createApolloClient(token?)` で生成する。JWT トークンを渡すと `Authorization: Bearer <token>` ヘッダーが自動付与される
- トークンは `lib/auth.ts` の `getToken()` で Cookie から取得し、`app/layout.tsx` が Server Component として読み込んで `Providers` に渡す
- GraphQL クエリの型は `graphql-codegen`（`npm run codegen`）で自動生成し `lib/gql/` に出力する。手動型定義は書かない
- ページネーションのマージは `fetchMore` の `updateQuery` ではなく、`lib/apollo-client.ts` の `typePolicies` に `merge` 関数として定義する
- Rails の `ISO8601DateTime` / `ISO8601Date` スカラーは `string` にマッピング済み（`codegen.ts` の `scalars` を参照）。新しい日時スカラーを追加した場合も同様に設定すること

## smarthr-ui

- CSS は `app/layout.tsx` で `import "smarthr-ui/smarthr-ui.css"` をインポートする
- `ThemeProvider`・`IntlProvider` は `components/Providers.tsx` でまとめて設定する
- `IntlProvider` には `smarthr-ui/lib/intl/locales/ja` の `locale` を `messages` prop に渡すこと（未設定だと MISSING_TRANSLATION エラーが出る）
- Table は `<Table>` + ネイティブ `<thead>/<tbody>/<tr>` + `<Th>/<Td>` の組み合わせで使う（`TableHead` 等は存在しない）
- `FormControl` の必須ラベルは `requireText`（旧API・存在しない）ではなく `statusLabels={<StatusLabel key="required" type="red">必須</StatusLabel>}` で表示する。`statusLabels` は内部で配列化されるため `key` が必須
- `Select` のオプションは `children` ではなく `options={[{ value, label }]}` で渡す（`label` プロパティが表示テキストになる）
- `AnchorButton elementAs={Link}` は Client Component 内でのみ使用可能。Server Component から関数を props として渡すと Next.js がエラーを出す
- Apollo ミューテーションのレスポンスには「更新したフィールドをすべて含める」こと。含めないフィールドはミューテーション後もキャッシュが更新されず、画面に古い値が残る
