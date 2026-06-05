---
paths:
  - "tests/**/*.test.tsx"
  - "tests/**/*.test.ts"
  - "vitest.config.ts"
  - "vitest.setup.ts"
---

## テスト環境

- テストフレームワーク: Vitest + @testing-library/react
- テストファイルは `tests/<ディレクトリ名>/` に配置する（本体と同階層には置かない）
- テスト内のインポートは `@/` エイリアスを使う（相対パス不可）

## Apollo Client のモック

- `MockedProvider` は `@apollo/client/testing/react` からインポートする（v4 で分離）
- `addTypename` prop は不要（v4 の MockLink が内部で両側を正規化してマッチングするため）

## jsdom の補完

- `smarthr-ui` の Table が `ResizeObserver` を使うため、`vitest.setup.ts` にスタブを定義済み
- jsdom に存在しないブラウザ API が必要になった場合は同ファイルに追記する
