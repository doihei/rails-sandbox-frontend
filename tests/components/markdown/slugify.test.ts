import { describe, it, expect } from "vitest";
import { slugify } from "@/components/markdown/slugify";

describe("slugify", () => {
  it("ASCII + スペースをハイフン区切りの小文字に変換する", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("ハイフンを保持する", () => {
    expect(slugify("hello-world")).toBe("hello-world");
  });

  it("日本語をそのまま保持する", () => {
    expect(slugify("見出し1")).toBe("見出し1");
  });

  it("日本語 + 英数字の混在を扱える", () => {
    expect(slugify("見出し Hello")).toBe("見出し-hello");
  });

  it("記号を除去する", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("前後の空白を削除する", () => {
    expect(slugify("  padded  ")).toBe("padded");
  });

  it("空文字列を返す", () => {
    expect(slugify("")).toBe("");
  });

  it("連続空白をひとつのハイフンにまとめる", () => {
    expect(slugify("a  b")).toBe("a-b");
  });
});
