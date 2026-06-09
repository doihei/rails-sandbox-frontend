"use client";

import { useQuery } from "@apollo/client/react";
import { Table, Th, Td, Button, Text, StatusLabel } from "smarthr-ui";
import { ARTICLES_QUERY } from "@/lib/queries/articles";
import Link from "next/link";

export function ArticleList() {
  const { data, loading, error, fetchMore } = useQuery(
    ARTICLES_QUERY,
    { variables: { first: 10 } }
  );

  if (loading) return <Text>読み込み中...</Text>;
  if (error)   return <Text>エラー: {error.message}</Text>;
  if (!data)   return null;

  const nodes = (data.articles.nodes ?? []).filter(
    (a): a is NonNullable<typeof a> => a !== null
  );
  const { pageInfo } = data.articles;

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <Th style={{ minWidth: 280 }}>タイトル</Th>
            <Th style={{ width: 120 }}>ステータス</Th>
            <Th style={{ width: 120 }}>著者</Th>
            <Th>タグ</Th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((article) => (
            <tr key={article.id}>
              <Td>
                <Link href={`/articles/${article.id}`} style={{ color: "inherit" }}>
                  {article.title}
                </Link>
              </Td>
              <Td>
                <StatusLabel type={article.status === "published" ? "green" : "grey"}>
                  {article.status}
                </StatusLabel>
              </Td>
              <Td>
                {article.user.name ?? article.user.email}
              </Td>
              <Td>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {article.tags.map((tag) => (
                    <StatusLabel key={tag.id} type="blue">
                      {tag.name}
                    </StatusLabel>
                  ))}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {pageInfo.hasNextPage && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <Button
            variant="secondary"
            onClick={() => fetchMore({ variables: { after: pageInfo.endCursor } })}
          >
            もっと見る
          </Button>
        </div>
      )}
    </div>
  );
}
