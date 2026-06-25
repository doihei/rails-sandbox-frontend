import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor } from "storybook/test";
import { SiteHeader } from "@/components/SiteHeader";

const meta = {
  component: SiteHeader,
  tags: ["ai-generated"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticlesActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/articles" },
    },
  },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByRole("link", { name: "記事一覧" })).toBeVisible()
    );
    expect(canvas.getByRole("link", { name: "記事一覧" })).toHaveAttribute("aria-current", "page");
  },
};

export const TagsActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/tags" },
    },
  },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByRole("link", { name: "タグ一覧" })).toBeVisible()
    );
    expect(canvas.getByRole("link", { name: "タグ一覧" })).toHaveAttribute("aria-current", "page");
  },
};

export const Home: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/" },
    },
  },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByRole("link", { name: "記事一覧" })).toBeVisible()
    );
    expect(canvas.getByRole("link", { name: "記事一覧" })).not.toHaveAttribute("aria-current", "page");
    expect(canvas.getByRole("link", { name: "タグ一覧" })).not.toHaveAttribute("aria-current", "page");
  },
};
