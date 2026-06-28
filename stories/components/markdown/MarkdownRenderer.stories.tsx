import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";

const meta = {
  component: MarkdownRenderer,
  tags: ["ai-generated"],
} satisfies Meta<typeof MarkdownRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

const ALL_ELEMENTS = `# 見出し1

## 見出し2

### 見出し3

通常テキストと**太字**と*斜体*と~~打消し~~。

\`\`\`typescript
const greeting = (name: string): string => {
  return \`Hello, \${name}!\`
}
\`\`\`

インライン \`code\` もあります。

> 引用ブロック

| カラム1 | カラム2 |
|---------|---------|
| セル1   | セル2   |

- リスト1
- リスト2
  - ネスト
    - さらにネスト

[外部リンク](https://example.com)
`;

export const AllElements: Story = {
  args: { content: ALL_ELEMENTS },
};

export const Empty: Story = {
  args: { content: "" },
};

export const CodeHighlight: Story = {
  args: {
    content: `\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
}

function getUser(id: number): Promise<User> {
  return fetch(\`/api/users/\${id}\`).then(r => r.json())
}
\`\`\``,
  },
};
