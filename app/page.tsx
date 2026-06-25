import { Cluster, Heading, Section, Stack, TextLink } from 'smarthr-ui'
import Link from 'next/link'
import { PageLayout } from '@/components/PageLayout'
import { RecentArticles } from '@/components/articles/RecentArticles'
import { PopularTags } from '@/components/tags/PopularTags'

export default function HomePage() {
  return (
    <PageLayout>
      <Stack gap="XL">
        <Section>
          <Stack gap="M">
            <Cluster justify="space-between" align="center">
              <Heading type="sectionTitle">最近の記事</Heading>
              <TextLink href="/articles" elementAs={Link}>すべて見る</TextLink>
            </Cluster>
            <RecentArticles />
          </Stack>
        </Section>

        <Section>
          <Stack gap="M">
            <Cluster justify="space-between" align="center">
              <Heading type="sectionTitle">人気のタグ</Heading>
              <TextLink href="/tags" elementAs={Link}>すべて見る</TextLink>
            </Cluster>
            <PopularTags />
          </Stack>
        </Section>
      </Stack>
    </PageLayout>
  )
}
