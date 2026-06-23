# rails-sandbox-frontend

[![Test](https://github.com/doihei/rails-sandbox-frontend/actions/workflows/test.yml/badge.svg)](https://github.com/doihei/rails-sandbox-frontend/actions/workflows/test.yml)

rails-sandbox-backend の GraphQL API を Apollo Client で取得・表示する Next.js フロントエンド。

## 前提条件

- Node.js 22 以上 / React 19
- バックエンドが `localhost:8080` で起動していること（`cd ../rails-sandbox-backend && docker compose up`）。
- ログイン機能あり。初期ユーザーはバックエンドの `db/seeds.rb` を参照。

## 起動

```bash
npm install
npm run codegen  # バックエンド起動後に型を生成
npm run dev
```

http://localhost:3000

## Docker で起動

```bash
docker build \
  --build-arg NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8080/graphql \
  -t rails-sandbox-frontend .
docker run -p 3000:3000 rails-sandbox-frontend
```

http://localhost:3000

## GCP Cloud Run へのデプロイ

`cloudbuild.yaml` を使って Cloud Build でビルドする。`NEXT_PUBLIC_GRAPHQL_ENDPOINT` はビルド時に注入する必要がある（Next.js の `NEXT_PUBLIC_` 変数はビルド時に埋め込まれるため、実行時環境変数は効かない）。

```bash
gcloud builds submit --config=cloudbuild.yaml \
  --project=<PROJECT_ID> \
  --substitutions=_SHA=$(git rev-parse --short HEAD),_GRAPHQL_ENDPOINT=<API_URL>/graphql \
  .
```

通常は `rails-sandbox-infra/deploy.sh` が API URL の取得も含めて一括実行する。

## Storybook

```bash
npm run storybook        # 開発サーバー起動（http://localhost:6006）
npm run build-storybook  # 静的ファイルをビルド
```

## テスト

### ユニットテスト・Story テスト（Vitest）

Story テストは `npm run test:run` に統合されています（Storybook 起動不要）。  
Chromium が必要なため、初回のみインストールしてください：

```bash
npx playwright install chromium --with-deps
```

```bash
npm test          # ウォッチモード
npm run test:run  # CI 向け（1回実行）
```

### a11y テスト（Playwright）

初回のみ、ブラウザをインストールする：

```bash
npx playwright install chromium
```

アプリを起動した状態で実行する（バックエンド + フロントエンド両方が必要）：

```bash
npm run dev       # 別ターミナルで起動
npm run test:a11y
```

### VRT・スクリーンショット回帰テスト（Playwright）

初回のみ、ブラウザをインストールする：

```bash
npx playwright install chromium
```

アプリを起動した状態で実行する：

```bash
npm run dev          # 別ターミナルで起動
npm run test:vrt     # スクリーンショットを既存ベースラインと比較
```

UI を意図的に変更した場合は、以下のフローでベースラインを更新する。**ベースラインは Linux（CI）のみ管理するため、ローカルの `--update-snapshots` は使わない。**

#### VRT ベースラインの更新フロー（自動）

`feat/*` ブランチで UI を変更すると CI が自動で対応する：

1. `feat/*` ブランチの PR を作成する
2. `vrt-snapshot.yml` が自動起動し、`vrt/<branch>` ブランチにスナップショットを生成して PR を作成する
3. スナップショット PR の「Files changed」でビジュアル差分を確認し、問題なければ feature ブランチにマージする
4. `vrt.yml` が比較テストを実行 → 通過したら feature PR を main にマージ可能

#### 手動更新（緊急時・fallback）

1. GitHub リポジトリの **Actions** タブ → **VRT** ワークフローを選択
2. **Run workflow** → `ベースラインを手動で更新して自動コミットする` にチェック → **Run workflow**
