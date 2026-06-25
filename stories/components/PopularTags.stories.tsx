import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MockedProvider } from "@apollo/client/testing/react";
import { expect, waitFor } from "storybook/test";
import { PopularTags } from "@/components/tags/PopularTags";
import { GET_TAGS } from "@/lib/queries/tag";

const mockNodes = [
  { id: "t1", name: "rails", articlesCount: 10 },
  { id: "t2", name: "typescript", articlesCount: 5 },
  { id: "t3", name: "docker", articlesCount: 3 },
  { id: "t4", name: "graphql", articlesCount: 2 },
  { id: "t5", name: "ruby", articlesCount: 1 },
];

const successMock = {
  request: {
    query: GET_TAGS,
    variables: { first: 5 },
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

const meta = {
  component: PopularTags,
  tags: ["ai-generated"],
} satisfies Meta<typeof PopularTags>;

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

export const Loading: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[{ ...successMock, delay: Infinity }]}>
        <Story />
      </MockedProvider>
    ),
  ],
};
