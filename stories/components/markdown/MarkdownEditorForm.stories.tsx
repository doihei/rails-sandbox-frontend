import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, fn } from "storybook/test";
import { MarkdownEditorForm } from "@/components/markdown/MarkdownEditorForm";

const meta = {
  component: MarkdownEditorForm,
  tags: ["ai-generated"],
  args: { onChange: fn() },
} satisfies Meta<typeof MarkdownEditorForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_CONTENT = `# 見出し1

通常テキストと**太字**と*斜体*。

\`\`\`typescript
const x: number = 42
\`\`\`

- リスト1
- リスト2
`;

export const Default: Story = {
  args: { value: "" },
};

export const WithContent: Story = {
  args: { value: SAMPLE_CONTENT },
};

export const PreviewTab: Story = {
  args: { value: SAMPLE_CONTENT },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("tab", { name: "プレビュー" }));

    await waitFor(() => {
      expect(canvas.getByRole("heading", { level: 1 })).toBeVisible();
    });
  },
};

export const ErrorState: Story = {
  args: { value: "", error: true },
};
