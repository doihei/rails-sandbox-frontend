import { ArticleList } from "@/components/ArticleList";

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>
        記事一覧
      </h1>
      <ArticleList />
    </main>
  );
}