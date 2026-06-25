'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AppNavi, AppNaviAnchor, Header } from 'smarthr-ui'
import { LogoutButton } from './LogoutButton'

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <>
      <Header logo={<span>Rails Sandbox</span>} logoHref="/" />
      <AppNavi additionalArea={<LogoutButton />}>
        <AppNaviAnchor elementAs={Link} href="/articles" current={pathname.startsWith('/articles')}>
          記事一覧
        </AppNaviAnchor>
        <AppNaviAnchor elementAs={Link} href="/tags" current={pathname.startsWith('/tags')}>
          タグ一覧
        </AppNaviAnchor>
      </AppNavi>
    </>
  )
}
