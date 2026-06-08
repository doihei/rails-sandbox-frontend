---
paths:
  - "docker/**/*"
  - "docker-compose.yml"
---

## Docker 構成

### ファイルの場所
- `docker/Dockerfile.dev` — 開発用（docker-compose で使用）
- `docker/Dockerfile` — Cloud Run 用本番イメージ（standalone ビルド）

### 起動方法
- 単体起動: `docker compose up -d`
- 全サービス一括起動: `smart-hr-sandbox/` ルートで `make up`

### 環境変数
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT` — GraphQL エンドポイント（デフォルト: `http://localhost:8080/graphql`）
- `GRAPHQL_ENDPOINT_SERVER` — Server Action 用 GraphQL エンドポイント。コンテナ内からは `localhost` がコンテナ自身を指すため `http://host.docker.internal:8080/graphql` を設定する
- `WATCHPACK_POLLING=true` — Docker 上でホットリロードを有効にするための設定

### ホットリロードについて
Docker 上では `WATCHPACK_POLLING=true` が必須。これがないとファイル変更が検知されない。