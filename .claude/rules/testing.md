---
paths:
  - "tests/**/*.test.tsx"
  - "tests/**/*.test.ts"
  - "tests/a11y/**/*.spec.ts"
  - "vitest.config.ts"
  - "vitest.setup.ts"
  - "playwright.config.ts"
---

## テスト環境

- テストフレームワーク: Vitest + @testing-library/react
- テストファイルは `tests/<ディレクトリ名>/` に配置する（本体と同階層には置かない）
- テスト内のインポートは `@/` エイリアスを使う（相対パス不可）

## コンポーネントのレンダリング

- smarthr-ui コンポーネントを含むテストは `IntlProvider`（`locale="ja"`）+ `ThemeProvider`（`createTheme()`）でラップする
- 本番の `components/Providers.tsx` は Apollo を含むためテストでは使わず、テスト用のラップヘルパーを各テストで用意する

## Apollo Client のモック

- `MockedProvider` は `@apollo/client/testing/react` からインポートする（v4 で分離）
- `addTypename` prop は不要（v4 の MockLink が内部で両側を正規化してマッチングするため）
- `mocks` 配列の型は `MockLink.MockedResponse[]` を使う（`any[]` は型エラー、旧 `MockedResponse` は deprecated）
  - `MockLink` は `@apollo/client/testing` からインポートする

## a11y テスト（Playwright + axe-core）

- a11y テストは `tests/a11y/` に配置し、`*.spec.ts` の拡張子を使う
- テスト実行は `npm run test:a11y`。アプリが `http://localhost:3000` で起動している必要がある
- `AxeBuilder.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])` で WCAG 2.1 AA 準拠を検査する
- ログインが必要なページはファイル内に `login(page: Page)` ヘルパーを定義して各テスト冒頭で呼ぶ
- バリデーションエラーなど状態変化後も axe 検査を行い、エラー表示時の違反も確認する

## jsdom の補完

- `smarthr-ui` の Table が `ResizeObserver` を使うため、`vitest.setup.ts` にスタブを定義済み
- jsdom に存在しないブラウザ API が必要になった場合は同ファイルに追記する
