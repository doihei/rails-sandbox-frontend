import { Heading, Stack } from 'smarthr-ui'
import { PageLayout } from '@/components/PageLayout'
import { TagList } from '@/components/tags/TagList'

export default function TagsPage() {
  return (
    <PageLayout>
      <Stack gap="L">
        <Heading>タグ一覧</Heading>
        <TagList />
      </Stack>
    </PageLayout>
  )
}
