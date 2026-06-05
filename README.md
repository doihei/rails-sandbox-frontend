# rails-sandbox-front

[![Test](https://github.com/doihei/rails-sandbox-front/actions/workflows/test.yml/badge.svg)](https://github.com/doihei/rails-sandbox-front/actions/workflows/test.yml)

rails-sandbox の GraphQL API を Apollo Client で取得・表示する Next.js フロントエンド。

## 前提条件

- Node.js 22 以上 / React 19
- バックエンドが `localhost:8080` で起動していること（`cd ../rails-sandbox && docker compose up`）。

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
  -t rails-sandbox-front .
docker run -p 3000:3000 rails-sandbox-front
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

## テスト

```bash
npm test          # ウォッチモード
npm run test:run  # CI 向け（1回実行）
```
