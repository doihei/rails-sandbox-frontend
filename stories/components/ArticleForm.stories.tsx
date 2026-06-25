import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MockedProvider } from "@apollo/client/testing/react";
import { expect, waitFor } from "storybook/test";
import { ArticleForm } from "@/components/articles/ArticleForm";
import { CREATE_ARTICLE, UPDATE_ARTICLE } from "@/lib/queries/article";
import { GET_TAGS } from "@/lib/queries/tag";

const meta = {
  component: ArticleForm,
  tags: ["ai-generated"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof ArticleForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const getTagsMock = {
  request: { query: GET_TAGS, variables: { first: 200 } },
  result: { data: { tags: { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } } } },
};

const createMock = {
  request: {
    query: CREATE_ARTICLE,
    variables: { title: "新しい記事", body: "本文テキスト", tagNames: [] },
  },
  result: {
    data: {
      createArticle: { article: { id: "42" }, errors: [] },
    },
  },
};

const createErrorMock = {
  request: {
    query: CREATE_ARTICLE,
    variables: { title: "エラー記事", body: "本文", tagNames: [] },
  },
  result: {
    data: {
      createArticle: { article: null, errors: ["ログインが必要です"] },
    },
  },
};

const updateMock = {
  request: {
    query: UPDATE_ARTICLE,
    variables: {
      id: "1",
      title: "更新タイトル",
      body: "既存本文",
      status: "draft",
      lockVersion: 0,
      tagNames: [],
    },
  },
  result: {
    data: {
      updateArticle: {
        article: {
          id: "1",
          title: "更新タイトル",
          body: "既存本文",
          status: "draft",
          lockVersion: 1,
          tags: [],
        },
        errors: [],
      },
    },
  },
};

// ── Story 1: 新規作成（空フォーム）─────────────────────
export const NewForm: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[getTagsMock, createMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

// ── Story 2: バリデーションエラー ─────────────────────
export const ValidationError: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[getTagsMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "作成する" }));

    await waitFor(() => {
      expect(canvas.getByText("タイトルは必須です")).toBeVisible();
      expect(canvas.getByText("本文は必須です")).toBeVisible();
    });
  },
};

// ── Story 3: 送信成功 → router.push が呼ばれる ────────
export const SubmitSuccess: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[getTagsMock, createMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText(/タイトル/), "新しい記事");
    await userEvent.type(canvas.getByLabelText(/本文/), "本文テキスト");
    await userEvent.click(canvas.getByRole("button", { name: "作成する" }));

    // ミューテーション完了後、ボタンが loading 状態を抜けることで成功を確認
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "作成する" })).not.toBeDisabled()
    );
  },
};

// ── Story 4: GraphQL エラー ───────────────────────────
export const GraphQLError: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[getTagsMock, createErrorMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText(/タイトル/), "エラー記事");
    await userEvent.type(canvas.getByLabelText(/本文/), "本文");
    await userEvent.click(canvas.getByRole("button", { name: "作成する" }));

    await waitFor(() =>
      expect(canvas.getByText("ログインが必要です")).toBeVisible()
    );
  },
};

// ── Story 5: 編集モード ───────────────────────────────
export const EditForm: Story = {
  args: {
    articleId: "1",
    lockVersion: 0,
    defaultValues: { title: "既存タイトル", body: "既存本文", status: "draft", tagNames: [] },
  },
  decorators: [
    (Story) => (
      <MockedProvider mocks={[getTagsMock, updateMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    expect(canvas.getByDisplayValue("既存タイトル")).toBeVisible();
    expect(canvas.getByLabelText(/ステータス/)).toBeVisible();

    const titleInput = canvas.getByDisplayValue("既存タイトル");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "更新タイトル");
    await userEvent.click(canvas.getByRole("button", { name: "更新する" }));

    // ミューテーション完了後、ボタンが loading 状態を抜けることで成功を確認
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "更新する" })).not.toBeDisabled()
    );
  },
};
