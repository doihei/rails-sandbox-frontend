import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor } from "storybook/test";
import { MarkdownToc } from "@/components/markdown/MarkdownToc";

const meta = {
  component: MarkdownToc,
  tags: ["ai-generated"],
} satisfies Meta<typeof MarkdownToc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: `# 見出し1\n## 見出し2\n### 見出し3`,
  },
};

export const NoHeadings: Story = {
  args: { content: "見出しのないテキスト" },
  play: async ({ canvas }) => {
    // 目次が描画されないことを確認
    await waitFor(() => {
      expect(canvas.queryByRole("navigation", { name: "目次" })).toBeNull();
    });
  },
};

export const DeepNest: Story = {
  args: {
    content: `# h1\n## h2\n### h3\n#### h4\n##### h5\n###### h6`,
  },
};

export const CodeBlockHeadings: Story = {
  args: {
    content: `# 本物の見出し\n\`\`\`\n# コード内の見出し（除外される）\n\`\`\`\n## 本物の見出し2`,
  },
  play: async ({ canvas }) => {
    await waitFor(() => {
      const links = canvas.getAllByRole("link");
      // コードブロック内の # は除外され、2件のみ
      expect(links).toHaveLength(2);
    });
  },
};
