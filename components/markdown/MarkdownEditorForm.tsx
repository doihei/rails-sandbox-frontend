'use client'

import { useState } from 'react'
import { Stack, TabBar, TabItem, Textarea } from 'smarthr-ui'
import { MarkdownRenderer } from './MarkdownRenderer'

type Tab = 'edit' | 'preview'

type Props = {
  value: string
  onChange: (value: string) => void
  id?: string
  rows?: number
  error?: boolean
  disabled?: boolean
}

export function MarkdownEditorForm({ value, onChange, id, rows = 10, error, disabled }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('edit')

  return (
    <Stack gap="XS">
      <TabBar>
        <TabItem
          id="edit"
          selected={activeTab === 'edit'}
          onClick={() => setActiveTab('edit')}
        >
          編集
        </TabItem>
        <TabItem
          id="preview"
          selected={activeTab === 'preview'}
          onClick={() => setActiveTab('preview')}
        >
          プレビュー
        </TabItem>
      </TabBar>

      {activeTab === 'edit' ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          width="100%"
          error={error}
          disabled={disabled}
        />
      ) : (
        <div
          style={{
            minHeight: `${rows * 1.6}em`,
            padding: '8px 12px',
            border: `1px solid var(--color-border)`,
            borderRadius: '4px',
            background: 'var(--color-white)',
          }}
        >
          {value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p style={{ color: 'var(--color-text-disabled)', margin: 0 }}>
              プレビューする内容がありません
            </p>
          )}
        </div>
      )}
    </Stack>
  )
}
