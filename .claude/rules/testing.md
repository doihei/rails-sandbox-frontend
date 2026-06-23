---
paths:
  - "tests/**/*.test.tsx"
  - "tests/**/*.test.ts"
  - "tests/a11y/**/*.spec.ts"
  - "tests/vrt/**/*.spec.ts"
  - "tests/helpers/**"
  - "stories/**/*.stories.tsx"
  - "vitest.config.ts"
  - "vitest.setup.ts"
  - "playwright.config.ts"
---

## テスト環境

- テストフレームワーク: Vitest + @testing-library/react
- テストファイルは `tests/components/<種別>/` に配置する（コンポーネントと同階層には置かない）
  - `tests/components/articles/` — 記事関連コンポーネントのテスト
  - `tests/components/comments/` — コメント関連コンポーネントのテスト
- テスト内のインポートは `@/` エイリアスを使う（相対パス不可）
- Playwright の `*.spec.ts` は Vitest が誤検出するため `vitest.config.ts` の `exclude` に `tests/a11y/**` と `tests/vrt/**` を設定済み。新たに Playwright テストを追加する場合もこれらのディレクトリに配置すること

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
- 認証・GraphQL モックの共通セットアップは `tests/helpers/` のヘルパーを使う（例: `setupArticlesMocks`）
- バリデーションエラーなど状態変化後も axe 検査を行い、エラー表示時の違反も確認する

## VRT（Playwright スクリーンショット回帰テスト）

- VRT テストは `tests/vrt/` に配置し、`*.spec.ts` の拡張子を使う
- テスト実行は `npm run test:vrt`。アプリが `http://localhost:3000` で起動している必要がある
- 認証・GraphQL モックの共通セットアップは `tests/helpers/` のヘルパーを使う（a11y と同じヘルパーを共有）
- ビューポートは `1280×720` に固定し、アニメーションは `--force-prefers-reduced-motion` で無効化済み（`playwright.config.ts` の vrt プロジェクト設定を参照）
- ベースライン画像は `tests/vrt/*.spec.ts-snapshots/` に保存し、git で管理する
- **ベースラインは Linux（CI）のみ管理する**。macOS など他 OS のスナップショットはコミットしない
- ベースラインの更新は `vrt-snapshot.yml` が自動で行う（詳細は README.md の「VRT ベースラインの更新フロー」を参照）
- 手動更新が必要な場合は GitHub Actions の `workflow_dispatch`（`update_snapshots: true`）を使う

## jsdom の補完

- `smarthr-ui` の Table が `ResizeObserver` を使うため、`vitest.setup.ts` にスタブを定義済み
- jsdom に存在しないブラウザ API が必要になった場合は同ファイルに追記する

## Storybook Story

- Story ファイルは `stories/<ディレクトリ名>/` に配置する（コンポーネントと同階層には置かない）
- 型インポートは `@storybook/nextjs-vite` から行う（`@storybook/react` は v8 の旧パッケージ）
- `expect`・`waitFor`・`fn` は `storybook/test` からインポートする（`@storybook/test` は v8）
- `userEvent`・`canvas` は play 関数の引数から受け取る（インポート不可）
- App Router を使うコンポーネントは `parameters.nextjs.appDirectory: true` を設定する
- `useRouter().push` のスパイは App Router モードでは不可。送信成功の確認はボタンの disabled 解除で代替する
- Story テストは `npm run test:run` に統合済み（Storybook 起動不要、Chromium が必要）
