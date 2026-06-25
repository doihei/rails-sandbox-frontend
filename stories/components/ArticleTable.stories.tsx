import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor } from "storybook/test";
import { ArticleTable } from "@/components/articles/ArticleTable";

const mockArticles = [
  {
    id: "1",
    title: "Railsで学ぶGraphQL",
    status: "published",
    commentsCount: 2,
    user: { name: "田中太郎", email: "tanaka@example.com" },
    tags: [{ id: "t1", name: "rails" }, { id: "t2", name: "graphql" }],
  },
  {
    id: "2",
    title: "Next.jsとApollo Client 4",
    status: "draft",
    commentsCount: 0,
    user: { name: null, email: "yamada@example.com" },
    tags: [],
  },
];

const meta = {
  component: ArticleTable,
  tags: ["ai-generated"],
} satisfies Meta<typeof ArticleTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    articles: mockArticles,
  },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByText(/Railsで学ぶGraphQL/)).toBeVisible()
    );
    const link = canvas.getByRole("link", { name: /Railsで学ぶGraphQL/ });
    expect(link.getAttribute("href")).toBe("/articles/1");
    expect(canvas.getByText("rails")).toBeVisible();
    expect(canvas.getByText("yamada@example.com")).toBeVisible();
  },
};

export const WithPagination: Story = {
  args: {
    articles: mockArticles,
    pageInfo: { hasNextPage: true, endCursor: "cursor-abc" },
    onFetchMore: () => {},
  },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "もっと見る" })).toBeVisible()
    );
  },
};
