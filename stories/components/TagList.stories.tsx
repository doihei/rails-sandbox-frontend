import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MockedProvider } from "@apollo/client/testing/react";
import { expect, waitFor } from "storybook/test";
import { TagList } from "@/components/tags/TagList";
import { GET_TAGS } from "@/lib/queries/tag";

const mockNodes = [
  { id: "t1", name: "rails", articlesCount: 10 },
  { id: "t2", name: "typescript", articlesCount: 5 },
  { id: "t3", name: "docker", articlesCount: 3 },
];

const successMock = {
  request: {
    query: GET_TAGS,
    variables: { first: 20 },
  },
  result: {
    data: {
      tags: {
        nodes: mockNodes,
        pageInfo: { hasNextPage: false, endCursor: null },
      },
    },
  },
};

const hasNextPageMock = {
  request: {
    query: GET_TAGS,
    variables: { first: 20 },
  },
  result: {
    data: {
      tags: {
        nodes: mockNodes,
        pageInfo: { hasNextPage: true, endCursor: "cursor-xyz" },
      },
    },
  },
};

const meta = {
  component: TagList,
  tags: ["ai-generated"],
} satisfies Meta<typeof TagList>;

export default meta;
type Story = StoryObj<typeof meta>;

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
      expect(canvas.getByText("rails")).toBeVisible()
    );
    expect(canvas.getByText("typescript")).toBeVisible();
  },
};

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

export const Loading: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[{ ...successMock, delay: Infinity }]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

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
