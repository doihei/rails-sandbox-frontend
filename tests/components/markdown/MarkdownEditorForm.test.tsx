import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { MarkdownEditorForm } from "@/components/markdown/MarkdownEditorForm";

function renderEditor(props: Partial<React.ComponentProps<typeof MarkdownEditorForm>> = {}) {
  const theme = createTheme();
  const defaults = { value: "", onChange: vi.fn(), id: "body" };
  return render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="ja">
        <MarkdownEditorForm {...defaults} {...props} />
      </IntlProvider>
    </ThemeProvider>
  );
}

describe("MarkdownEditorForm", () => {
  it("初期表示で「編集」タブが selected 状態になっている", () => {
    renderEditor();
    const editTab = screen.getByRole("tab", { name: "編集" });
    expect(editTab).toHaveAttribute("aria-selected", "true");
  });

  it("初期表示で Textarea が表示される", () => {
    renderEditor();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("「プレビュー」タブをクリックすると Textarea が消える", async () => {
    const user = userEvent.setup();
    renderEditor({ value: "# 見出し" });

    await user.click(screen.getByRole("tab", { name: "プレビュー" }));

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("「プレビュー」タブでマークダウンがレンダリングされる", async () => {
    const user = userEvent.setup();
    renderEditor({ value: "# 見出し" });

    await user.click(screen.getByRole("tab", { name: "プレビュー" }));

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("value が空のときプレビュータブで案内文が表示される", async () => {
    const user = userEvent.setup();
    renderEditor({ value: "" });

    await user.click(screen.getByRole("tab", { name: "プレビュー" }));

    expect(screen.getByText("プレビューする内容がありません")).toBeInTheDocument();
  });

  it("テキスト入力時に onChange が新しい値で呼ばれる", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderEditor({ onChange });

    await user.type(screen.getByRole("textbox"), "a");

    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("error={true} のとき Textarea が aria-invalid になる", () => {
    renderEditor({ error: true });
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("disabled={true} のとき Textarea が disabled になる", () => {
    renderEditor({ disabled: true });
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
