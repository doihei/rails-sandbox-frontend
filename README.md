# rails-sandbox-front

rails-sandbox の GraphQL API を Apollo Client で取得・表示する Next.js フロントエンド。

## 前提条件

バックエンドが `localhost:8080` で起動していること（`cd ../rails-sandbox && docker compose up`）。

## 起動

```bash
npm install
npm run codegen  # バックエンド起動後に型を生成
npm run dev
```

http://localhost:3000
