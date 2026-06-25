import { PageLayout } from '@/components/PageLayout'
import { TaggedArticleList } from '@/components/tags/TaggedArticleList'

export default async function TaggedArticlesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <PageLayout>
      <TaggedArticleList tagId={id} />
    </PageLayout>
  )
}
