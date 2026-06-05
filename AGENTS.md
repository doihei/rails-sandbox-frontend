<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## プロジェクトルール

詳細なルールは `.claude/rules/` に分割管理している。

- `architecture.md` — 技術スタック・ディレクトリ構成・Apollo/smarthr-ui の使用方針（全ファイルに常時適用）
- `testing.md` — テストの配置・モック・レンダリング方針（`paths` でテスト関連ファイルにのみ適用）

新しいルールは `.claude/rules/` に追加し、特定の言語・ディレクトリに限定したい場合は frontmatter の `paths` でスコープを絞る。
