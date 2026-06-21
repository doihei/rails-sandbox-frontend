import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MockedProvider } from "@apollo/client/testing/react";
import { ArticleList } from "@/components/ArticleList";
import { ARTICLES_QUERY } from "@/lib/queries/articles";
import { within, waitFor, expect } from "storybook/test";

// ── テスト用モックデータ ──────────────────────────────
const mockNodes = [
  {
    id: "1",
    title: "Railsで学ぶGraphQL",
    body: "本文1",
    status: "published",
    createdAt: "2024-01-01T00:00:00Z",
    user: { name: "田中太郎", email: "tanaka@example.com" },
    tags: [{ id: "t1", name: "rails" }, { id: "t2", name: "graphql" }],
  },
  {
    id: "2",
    title: "Next.jsとApollo Client 4",
    body: "本文2",
    status: "draft",
    createdAt: "2024-01-02T00:00:00Z",
    user: { name: null, email: "yamada@example.com" },
    tags: [],
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
    },
  },
}

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
    },
  },
}

// ── Meta ───────────────────────────────────────────────
const meta: Meta<typeof ArticleList> = {
  title: "Components/ArticleList",
  component: ArticleList,
};
export default meta;

type Story = StoryObj<typeof ArticleList>;

// ── Story 1: 通常表示 ──────────────────────────────────
export const Default: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[successMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ローディング → データ表示の遷移を確認
    await waitFor(() =>
      expect(canvas.getByText("Railsで学ぶGraphQL")).toBeInTheDocument()
    );

    // タイトルがリンクになっている
    const link = canvas.getByRole("link", { name: "Railsで学ぶGraphQL" });
    expect(link).toHaveAttribute("href", "/articles/1");

    // タグが表示される
    expect(canvas.getByText("rails")).toBeInTheDocument();

    // name が null の場合は email を表示
    expect(canvas.getByText("yamada@example.com")).toBeInTheDocument();
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "もっと見る" })).toBeInTheDocument()
    );
  },
};

// ── Story 3: ローディング中 ───────────────────────────
export const Loading: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[{ ...successMock, delay: Infinity }]} >
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText(/エラー/)).toBeInTheDocument()
    );
  },
};
