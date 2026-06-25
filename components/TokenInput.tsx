'use client'

import { MultiCombobox } from 'smarthr-ui'

type Props = {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export function TokenInput({
  value,
  onChange,
  placeholder = 'タグを追加',
  maxTags = 10,
}: Props) {
  const selectedItems = value.map((tag) => ({ value: tag, label: tag }))

  return (
    <MultiCombobox
      items={[]}
      selectedItems={selectedItems}
      creatable
      placeholder={placeholder}
      onAdd={(label) => {
        const tag = label.trim().toLowerCase()
        if (tag && !value.includes(tag) && value.length < maxTags) {
          onChange([...value, tag])
        }
      }}
      onDelete={(item) => onChange(value.filter((t) => t !== item.value))}
      width="100%"
    />
  )
}
