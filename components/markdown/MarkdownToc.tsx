'use client'

import { useEffect, useMemo, useState } from 'react'
import { Stack, Text } from 'smarthr-ui'
import { slugify } from './slugify'
import styles from './MarkdownToc.module.css'

type Heading = { level: number; text: string; id: string }

function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = []
  let inCodeBlock = false

  for (const line of content.split('\n')) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = line.match(/^(#{1,6})\s+(.+)/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      headings.push({ level, text, id: slugify(text) })
    }
  }

  return headings
}

type Props = { content: string }

export function MarkdownToc({ content }: Props) {
  const headings = useMemo(() => extractHeadings(content), [content])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollTop = window.scrollY + 120
      let current = headings[0].id
      for (const { id } of headings) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollTop) current = id
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length === 0) return null

  const minLevel = Math.min(...headings.map(h => h.level))

  return (
    <nav aria-label="目次">
      <Stack gap="XS">
        <Text size="S" weight="bold" color="TEXT_GREY" style={{ paddingLeft: '8px' }}>
          目次
        </Text>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {headings.map(({ level, text, id }) => (
            <li key={id} style={{ paddingLeft: `${(level - minLevel) * 12}px` }}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`${styles.link} ${activeId === id ? styles.active : ''}`}
              >
                <Text
                  size="S"
                  color={activeId === id ? 'TEXT_LINK' : 'TEXT_GREY'}
                  weight={activeId === id ? 'bold' : 'normal'}
                  style={{ wordBreak: 'break-all', lineHeight: '1.5' }}
                >
                  {text}
                </Text>
              </a>
            </li>
          ))}
        </ul>
      </Stack>
    </nav>
  )
}
