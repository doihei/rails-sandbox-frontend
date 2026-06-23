import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing/react";
import { MockLink } from "@apollo/client/testing";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { CommentList } from "@/components/comments/CommentList";
import { DELETE_COMMENT } from "@/lib/queries/comment";
import { GET_ARTICLE } from "@/lib/queries/article";

function renderWithProviders(ui: React.ReactElement, mocks: MockLink.MockedResponse[] = []) {
  const theme = createTheme();
  return render(
    <MockedProvider mocks={mocks}>
      <ThemeProvider theme={theme}>
        <IntlProvider locale="ja">
          {ui}
        </IntlProvider>
      </ThemeProvider>
    </MockedProvider>
  );
}

const ARTICLE_ID = "1";

const mockComments = [
  {
    id: "c1",
    body: "テストコメント1",
    createdAt: "2024-01-01T00:00:00Z",
    user: { id: "u1", name: "テストユーザー", email: "user1@example.com" },
  },
  {
    id: "c2",
    body: "テストコメント2",
    createdAt: "2024-01-02T00:00:00Z",
    user: { id: "u2", name: null, email: "user2@example.com" },
  },
];

const articleRefetchMock: MockLink.MockedResponse = {
  request: {
    query: GET_ARTICLE,
    variables: { id: ARTICLE_ID },
  },
  result: {
    data: {
      article: {
        id: ARTICLE_ID,
        title: "テスト記事",
        body: "テスト本文",
        status: "published",
        lockVersion: 0,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        commentsCount: 0,
        user: { id: "u1", name: "テストユーザー", email: "user1@example.com" },
        tags: [],
        comments: [],
      },
      me: { id: "u1" },
    },
  },
};

describe("CommentList", () => {
  it("コメントがない場合「まだコメントはありません」を表示する", () => {
    renderWithProviders(
      <CommentList comments={[]} articleId={ARTICLE_ID} meId={undefined} />
    );
    expect(screen.getByText("まだコメントはありません")).toBeInTheDocument();
  });

  it("コメント本文が表示される", () => {
    renderWithProviders(
      <CommentList comments={mockComments} articleId={ARTICLE_ID} meId={undefined} />
    );
    expect(screen.getByText("テストコメント1")).toBeInTheDocument();
    expect(screen.getByText("テストコメント2")).toBeInTheDocument();
  });

  it("name が null の場合は email を表示する", () => {
    renderWithProviders(
      <CommentList comments={mockComments} articleId={ARTICLE_ID} meId={undefined} />
    );
    expect(screen.getByText(/user2@example\.com/)).toBeInTheDocument();
  });

  it("meId が一致するコメントに削除ボタンが表示される", () => {
    renderWithProviders(
      <CommentList comments={mockComments} articleId={ARTICLE_ID} meId="u1" />
    );
    // u1 は c1 のオーナー。c2 のオーナーは u2 なので削除ボタンは1つだけ
    expect(screen.getAllByRole("button", { name: "削除" })).toHaveLength(1);
  });

  it("meId が一致しない場合は削除ボタンが表示されない", () => {
    renderWithProviders(
      <CommentList comments={mockComments} articleId={ARTICLE_ID} meId="other-user" />
    );
    expect(screen.queryByRole("button", { name: "削除" })).not.toBeInTheDocument();
  });

  it("meId が undefined の場合は削除ボタンが表示されない", () => {
    renderWithProviders(
      <CommentList comments={mockComments} articleId={ARTICLE_ID} meId={undefined} />
    );
    expect(screen.queryByRole("button", { name: "削除" })).not.toBeInTheDocument();
  });

  it("削除ボタンをクリックすると DELETE_COMMENT mutation が呼ばれる", async () => {
    const user = userEvent.setup();
    let deleteCalled = false;

    const deleteMock: MockLink.MockedResponse = {
      request: {
        query: DELETE_COMMENT,
        variables: { id: "c1" },
      },
      result: () => {
        deleteCalled = true;
        return { data: { deleteComment: { success: true, errors: [] } } };
      },
    };

    renderWithProviders(
      <CommentList comments={mockComments} articleId={ARTICLE_ID} meId="u1" />,
      [deleteMock, articleRefetchMock]
    );

    await user.click(screen.getByRole("button", { name: "削除" }));

    await waitFor(() => {
      expect(deleteCalled).toBe(true);
    });
  });
});
