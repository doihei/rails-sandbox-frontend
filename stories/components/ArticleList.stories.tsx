import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MockedProvider } from "@apollo/client/testing/react";
import { waitFor, expect } from "storybook/test";
import { ArticleList } from "@/components/articles/ArticleList";
import { ARTICLES_QUERY } from "@/lib/queries/articles";

const mockNodes = [
  {
    id: "1",
    title: "Railsで学ぶGraphQL",
    body: "本文1",
    status: "published",
    createdAt: "2024-01-01T00:00:00Z",
    likesCount: 5,
    likedByMe: false,
    user: { id: "user-1", name: "田中太郎", email: "tanaka@example.com" },
    tags: [{ id: "t1", name: "rails" }, { id: "t2", name: "graphql" }],
    commentsCount: 2,
  },
  {
    id: "2",
    title: "Next.jsとApollo Client 4",
    body: "本文2",
    status: "draft",
    createdAt: "2024-01-02T00:00:00Z",
    likesCount: 0,
    likedByMe: false,
    user: { id: "user-2", name: null, email: "yamada@example.com" },
    tags: [],
    commentsCount: 0,
  },
];

const successMock = {
  request: {
    query: ARTICLES_QUERY,
    variables: { first: 10 },
  },
  result: {
    data: {
      articles: {
        nodes: mockNodes,
        pageInfo: { hasNextPage: false, endCursor: null },
      },
      me: { id: "me-1" },
    },
  },
};

const hasNextPageMock = {
  request: {
    query: ARTICLES_QUERY,
    variables: { first: 10 },
  },
  result: {
    data: {
      articles: {
        nodes: mockNodes,
        pageInfo: { hasNextPage: true, endCursor: "cursor-abc" },
      },
      me: { id: "me-1" },
    },
  },
};

const meta = {
  component: ArticleList,
  tags: ["ai-generated"],
} satisfies Meta<typeof ArticleList>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Story 1: 通常表示 ──────────────────────────────────
export const Default: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[successMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
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

// ── Story 2: 「もっと見る」ボタンあり ─────────────────
export const WithPagination: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[hasNextPageMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "もっと見る" })).toBeVisible()
    );
  },
};

// ── Story 3: ローディング中 ───────────────────────────
export const Loading: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[{ ...successMock, delay: Infinity }]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

// ── Story 4: エラー状態 ───────────────────────────────
export const WithError: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[{
        request: successMock.request,
        error: new Error("GraphQL Error"),
      }]}>
        <Story />
      </MockedProvider>
    ),
  ],
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByText(/エラー/)).toBeVisible()
    );
  },
};
