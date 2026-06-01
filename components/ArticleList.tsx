"use client";

import { useQuery } from "@apollo/client/react";
import { ARTICLES_QUERY, ArticlesQueryResult } from "@/lib/queries/articles";

export function ArticleList() {
  const { data, loading, error, fetchMore } = useQuery<ArticlesQueryResult>(
    ARTICLES_QUERY,
    { variables: { first: 10 } }
  );

  if (loading) return <p>読み込み中...</p>;
  if (error)   return <p>エラー: {error.message}</p>;
  if (!data)   return null;

  const { nodes, pageInfo } = data.articles;

  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {nodes.map((article) => (
          <li
            key={article.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "16px",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 16, fontWeight: 500 }}>{article.title}</h2>
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {article.status}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              {article.body.slice(0, 80)}...
            </p>
            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
              {article.tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    borderRadius: 99,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
              {article.user.name ?? article.user.email}
            </p>
          </li>
        ))}
      </ul>

      {pageInfo.hasNextPage && (
        <button
          onClick={() =>
            fetchMore({
              variables: { after: pageInfo.endCursor },
              updateQuery(prev, { fetchMoreResult }) {
                if (!fetchMoreResult) return prev;
                return {
                  articles: {
                    ...fetchMoreResult.articles,
                    nodes: [
                      ...prev.articles.nodes,
                      ...fetchMoreResult.articles.nodes,
                    ],
                  },
                };
              },
            })
          }
          style={{
            width: "100%",
            padding: "10px",
            background: "#1f2937",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          もっと見る
        </button>
      )}
    </div>
  );
}