'use client'

// TODO: sort 順を like 数 desc に変更予定。
// バックエンドに likes_count カラム追加 + articles フィールドへの sort 引数追加が必要。
// 対応時は ARTICLES_QUERY の変数と本コンポーネントの呼び出しを合わせて修正する。

import { useQuery } from '@apollo/client/react'
import { Text } from 'smarthr-ui'
import { ARTICLES_QUERY } from '@/lib/queries/articles'
import { ArticleTable } from './ArticleTable'

export function RecentArticles() {
  const { data, loading, error } = useQuery(ARTICLES_QUERY, { variables: { first: 5 } })

  if (loading) return <Text>読み込み中...</Text>
  if (error) return <Text>エラー: {error.message}</Text>

  const articles = (data?.articles.nodes ?? []).filter(
    (a): a is NonNullable<typeof a> => a !== null
  )

  return <ArticleTable articles={articles} />
}
