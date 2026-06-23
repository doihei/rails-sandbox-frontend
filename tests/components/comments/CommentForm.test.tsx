import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing/react";
import { MockLink } from "@apollo/client/testing";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { CommentForm } from "@/components/comments/CommentForm";
import { CREATE_COMMENT } from "@/lib/queries/comment";
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

describe("CommentForm", () => {
  it("テキストエリアと送信ボタンが表示される", () => {
    renderWithProviders(<CommentForm articleId={ARTICLE_ID} />);
    expect(screen.getByLabelText(/コメントを追加/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "コメントする" })).toBeInTheDocument();
  });

  it("本文が空のとき送信ボタンが aria-disabled になっている", () => {
    renderWithProviders(<CommentForm articleId={ARTICLE_ID} />);
    // smarthr-ui Button は native disabled の代わりに aria-disabled を使う
    expect(screen.getByRole("button", { name: "コメントする" })).toHaveAttribute("aria-disabled", "true");
  });

  it("本文を入力すると送信ボタンの aria-disabled が解除される", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommentForm articleId={ARTICLE_ID} />);

    await user.type(screen.getByLabelText(/コメントを追加/), "テストコメント");

    expect(screen.getByRole("button", { name: "コメントする" })).not.toHaveAttribute("aria-disabled", "true");
  });

  it("送信成功後にテキストエリアがクリアされる", async () => {
    const user = userEvent.setup();
    const createMock: MockLink.MockedResponse = {
      request: {
        query: CREATE_COMMENT,
        variables: { articleId: ARTICLE_ID, body: "テストコメント" },
      },
      result: {
        data: {
          createComment: {
            comment: {
              id: "c1",
              body: "テストコメント",
              createdAt: "2024-01-01T00:00:00Z",
              user: { name: "テストユーザー", email: "user1@example.com" },
            },
            errors: [],
          },
        },
      },
    };

    renderWithProviders(<CommentForm articleId={ARTICLE_ID} />, [createMock, articleRefetchMock]);

    const textarea = screen.getByLabelText(/コメントを追加/);
    await user.type(textarea, "テストコメント");
    await user.click(screen.getByRole("button", { name: "コメントする" }));

    await waitFor(() => {
      expect(textarea).toHaveValue("");
    });
  });

  it("GraphQL エラー時にエラーメッセージを表示する", async () => {
    const user = userEvent.setup();
    const errorMock: MockLink.MockedResponse = {
      request: {
        query: CREATE_COMMENT,
        variables: { articleId: ARTICLE_ID, body: "エラーコメント" },
      },
      result: {
        data: {
          createComment: {
            comment: null,
            errors: ["本文を入力してください"],
          },
        },
      },
    };

    renderWithProviders(<CommentForm articleId={ARTICLE_ID} />, [errorMock]);

    await user.type(screen.getByLabelText(/コメントを追加/), "エラーコメント");
    await user.click(screen.getByRole("button", { name: "コメントする" }));

    await waitFor(() => {
      expect(screen.getByText("本文を入力してください")).toBeInTheDocument();
    });
  });

  it("エラー後に再入力するとエラーメッセージが消える", async () => {
    const user = userEvent.setup();
    const errorMock: MockLink.MockedResponse = {
      request: {
        query: CREATE_COMMENT,
        variables: { articleId: ARTICLE_ID, body: "エラーコメント" },
      },
      result: {
        data: {
          createComment: {
            comment: null,
            errors: ["本文を入力してください"],
          },
        },
      },
    };
    const successMock: MockLink.MockedResponse = {
      request: {
        query: CREATE_COMMENT,
        variables: { articleId: ARTICLE_ID, body: "正しいコメント" },
      },
      result: {
        data: {
          createComment: {
            comment: {
              id: "c2",
              body: "正しいコメント",
              createdAt: "2024-01-01T00:00:00Z",
              user: { name: "テストユーザー", email: "user1@example.com" },
            },
            errors: [],
          },
        },
      },
    };

    renderWithProviders(<CommentForm articleId={ARTICLE_ID} />, [errorMock, successMock, articleRefetchMock]);

    const textarea = screen.getByLabelText(/コメントを追加/);

    // 1回目：エラー
    await user.type(textarea, "エラーコメント");
    await user.click(screen.getByRole("button", { name: "コメントする" }));
    await waitFor(() => {
      expect(screen.getByText("本文を入力してください")).toBeInTheDocument();
    });

    // 2回目：成功 → エラー消える
    await user.clear(textarea);
    await user.type(textarea, "正しいコメント");
    await user.click(screen.getByRole("button", { name: "コメントする" }));
    await waitFor(() => {
      expect(screen.queryByText("本文を入力してください")).not.toBeInTheDocument();
    });
  });
});
