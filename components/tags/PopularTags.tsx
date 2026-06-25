'use client'

import { useQuery } from '@apollo/client/react'
import { Badge, Chip, Cluster, Text } from 'smarthr-ui'
import Link from 'next/link'
import { GET_TAGS } from '@/lib/queries/tag'

export function PopularTags() {
  const { data, loading, error } = useQuery(GET_TAGS, { variables: { first: 5 } })

  if (loading) return <Text>読み込み中...</Text>
  if (error) return <Text>エラー: {error.message}</Text>

  const tags = (data?.tags.nodes ?? []).filter(
    (t): t is NonNullable<typeof t> => t !== null
  )

  return (
    <Cluster gap="S">
      {tags.map((tag) => (
        <Link key={tag.id} href={`/tags/${tag.id}`} style={{ textDecoration: 'none' }}>
          <Badge count={tag.articlesCount}>
            <Chip color="blue">{tag.name}</Chip>
          </Badge>
        </Link>
      ))}
    </Cluster>
  )
}
