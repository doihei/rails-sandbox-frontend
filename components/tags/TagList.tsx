'use client'

import { useQuery } from '@apollo/client/react'
import { Badge, Button, Chip, Cluster, Stack, Text } from 'smarthr-ui'
import Link from 'next/link'
import { GET_TAGS } from '@/lib/queries/tag'

export function TagList() {
  const { data, loading, error, fetchMore } = useQuery(GET_TAGS, {
    variables: { first: 20 },
    fetchPolicy: 'cache-and-network',
  })

  if (loading) return <Text>読み込み中...</Text>
  if (error) return <Text>エラー: {error.message}</Text>

  const tags = (data?.tags.nodes ?? []).filter(
    (t): t is NonNullable<typeof t> => t !== null
  )
  if (!tags.length) return <Text>タグがありません</Text>

  const { hasNextPage, endCursor } = data?.tags.pageInfo ?? {}

  return (
    <Stack gap="M">
      <Cluster gap="S">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/tags/${tag.id}`} style={{ textDecoration: 'none' }}>
            <Badge count={tag.articlesCount}>
              <Chip color="blue">{tag.name}</Chip>
            </Badge>
          </Link>
        ))}
      </Cluster>

      {hasNextPage && (
        <Cluster justify="center">
          <Button
            variant="secondary"
            onClick={() => fetchMore({ variables: { after: endCursor } })}
          >
            もっと見る
          </Button>
        </Cluster>
      )}
    </Stack>
  )
}
