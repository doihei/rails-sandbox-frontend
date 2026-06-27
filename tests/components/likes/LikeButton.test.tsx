import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing/react";
import { MockLink } from "@apollo/client/testing";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { LikeButton } from "@/components/likes/LikeButton";
import { TOGGLE_LIKE } from "@/lib/queries/like";

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

const defaultProps = {
  likeableId: "1",
  likeableType: "Article" as const,
  likesCount: 5,
  likedByMe: false,
  cacheId: "1",
};

const makeToggleMock = (
  variables: { likeableId: string; likeableType: string },
  result: { liked: boolean; likesCount: number },
  onCalled?: () => void,
): MockLink.MockedResponse => ({
  request: { query: TOGGLE_LIKE, variables },
  result: () => {
    onCalled?.();
    return {
      data: {
        toggleLike: {
          __typename: "ToggleLikePayload",
          liked: result.liked,
          likesCount: result.likesCount,
          errors: [],
        },
      },
    };
  },
});

describe("LikeButton", () => {
  it("未いいね状態: 🤍 とカウントを表示し aria-pressed が false になる", () => {
    renderWithProviders(<LikeButton {...defaultProps} likedByMe={false} />);
    const button = screen.getByRole("button", { name: "いいね 5" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveTextContent("🤍 5");
  });

  it("いいね済み状態: ❤️ とカウントを表示し aria-pressed が true になる", () => {
    renderWithProviders(<LikeButton {...defaultProps} likedByMe={true} />);
    const button = screen.getByRole("button", { name: "いいね 5" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveTextContent("❤️ 5");
  });

  it("Article: クリックで TOGGLE_LIKE mutation が正しい variables で呼ばれる", async () => {
    const user = userEvent.setup();
    let mutationCalled = false;

    renderWithProviders(
      <LikeButton {...defaultProps} />,
      [makeToggleMock({ likeableId: "1", likeableType: "Article" }, { liked: true, likesCount: 6 }, () => { mutationCalled = true; })],
    );

    await user.click(screen.getByRole("button", { name: "いいね 5" }));

    await waitFor(() => expect(mutationCalled).toBe(true));
  });

  it("Comment: クリックで TOGGLE_LIKE mutation が likeableType='Comment' で呼ばれる", async () => {
    const user = userEvent.setup();
    let mutationCalled = false;

    renderWithProviders(
      <LikeButton likeableId="c1" likeableType="Comment" likesCount={1} likedByMe={false} cacheId="c1" />,
      [makeToggleMock({ likeableId: "c1", likeableType: "Comment" }, { liked: true, likesCount: 2 }, () => { mutationCalled = true; })],
    );

    await user.click(screen.getByRole("button", { name: "いいね 1" }));

    await waitFor(() => expect(mutationCalled).toBe(true));
  });

  it("ミューテーション実行中はボタンが disabled になる", async () => {
    const user = userEvent.setup();

    const delayedMock: MockLink.MockedResponse = {
      request: { query: TOGGLE_LIKE, variables: { likeableId: "1", likeableType: "Article" } },
      delay: Infinity,
      result: {
        data: {
          toggleLike: { __typename: "ToggleLikePayload", liked: true, likesCount: 6, errors: [] },
        },
      },
    };

    renderWithProviders(<LikeButton {...defaultProps} />, [delayedMock]);
    const button = screen.getByRole("button", { name: "いいね 5" });
    await user.click(button);

    // smarthr-ui Button は aria-disabled="true" で無効状態を表現する
    await waitFor(() => expect(button).toHaveAttribute("aria-disabled", "true"));
  });

  it("disabled=true のとき aria-disabled が true になる（自己いいね禁止の UI 制御）", () => {
    renderWithProviders(<LikeButton {...defaultProps} disabled={true} />);
    const button = screen.getByRole("button", { name: "いいね 5" });
    expect(button).toHaveAttribute("aria-disabled", "true");
  });
});
