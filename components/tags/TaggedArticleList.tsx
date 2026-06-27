'use client'

import { useQuery } from '@apollo/client/react'
import { Heading, Stack, Text } from 'smarthr-ui'
import { GET_TAGGED_ARTICLES, GET_TAGS } from '@/lib/queries/tag'
import { ArticleTable } from '@/components/articles/ArticleTable'

type Props = {
  tagId: string
}

export function TaggedArticleList({ tagId }: Props) {
  const { data: tagsData } = useQuery(GET_TAGS, {
    variables: { first: 200 },
    fetchPolicy: 'cache-and-network',
  })
  const { data, loading, error, fetchMore } = useQuery(GET_TAGGED_ARTICLES, {
    variables: { tagId, first: 10 },
    fetchPolicy: 'cache-and-network',
  })

  const tag = tagsData?.tags.nodes?.find((t) => t?.id === tagId)
  const articles = (data?.taggedArticles.nodes ?? []).filter(
    (a): a is NonNullable<typeof a> => a !== null
  )

  return (
    <Stack gap="L">
      <div>
        <Heading>#{tag?.name ?? 'タグ'} の記事一覧</Heading>
        <Text as="p">{tag?.articlesCount ?? 0} 件</Text>
      </div>

      {loading && <Text>読み込み中...</Text>}
      {error && <Text>エラー: {error.message}</Text>}
      {!loading && !error && (
        <ArticleTable
          articles={articles}
          pageInfo={data?.taggedArticles.pageInfo}
          meId={data?.me?.id}
          onFetchMore={() =>
            fetchMore({ variables: { after: data?.taggedArticles.pageInfo.endCursor } })
          }
        />
      )}
    </Stack>
  )
}
