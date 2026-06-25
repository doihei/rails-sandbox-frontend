'use client'

import { MultiCombobox } from 'smarthr-ui'

type Props = {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  suggestedItems?: Array<{ value: string; label: string }>
}

export function TokenInput({
  value,
  onChange,
  placeholder = 'タグを追加',
  maxTags = 10,
  suggestedItems = [],
}: Props) {
  const selectedItems = value.map((tag) => ({ value: tag, label: tag }))

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase()
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag])
    }
  }

  return (
    <MultiCombobox
      items={suggestedItems}
      selectedItems={selectedItems}
      creatable
      placeholder={placeholder}
      onSelect={(item) => addTag(item.value)}
      onAdd={addTag}
      onDelete={(item) => onChange(value.filter((t) => t !== item.value))}
      width="100%"
    />
  )
}
