"use client";

import { useQuery } from "@apollo/client/react";
import { Text } from "smarthr-ui";
import { ARTICLES_QUERY } from "@/lib/queries/articles";
import { ArticleTable } from "./ArticleTable";

export function ArticleList() {
  const { data, loading, error, fetchMore } = useQuery(
    ARTICLES_QUERY,
    { variables: { first: 10 } }
  );

  if (loading) return <Text>読み込み中...</Text>;
  if (error)   return <Text>エラー: {error.message}</Text>;
  if (!data)   return null;

  const articles = (data.articles.nodes ?? []).filter(
    (a): a is NonNullable<typeof a> => a !== null
  );

  return (
    <ArticleTable
      articles={articles}
      pageInfo={data.articles.pageInfo}
      onFetchMore={() => fetchMore({ variables: { after: data.articles.pageInfo.endCursor } })}
    />
  );
}
