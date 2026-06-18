import { describe, expect, it } from "vitest";
import { parsePrUrl } from "../parsePrUrl";

describe("parsePrUrl", () => {
  it("parses a standard PR URL", () => {
    expect(parsePrUrl("https://github.com/facebook/react/pull/28654")).toEqual({
      owner: "facebook",
      repo: "react",
      number: 28654,
    });
  });

  it("parses a PR URL with a sub-path (Files tab)", () => {
    expect(
      parsePrUrl("https://github.com/facebook/react/pull/28654/files"),
    ).toEqual({ owner: "facebook", repo: "react", number: 28654 });
  });

  it("parses a PR URL with a query string", () => {
    expect(
      parsePrUrl("https://github.com/facebook/react/pull/28654?w=1"),
    ).toEqual({ owner: "facebook", repo: "react", number: 28654 });
  });

  it("parses a PR URL with trailing whitespace", () => {
    expect(
      parsePrUrl("  https://github.com/facebook/react/pull/28654  "),
    ).toEqual({ owner: "facebook", repo: "react", number: 28654 });
  });

  it("returns null for a non-GitHub URL", () => {
    expect(
      parsePrUrl("https://gitlab.com/org/repo/merge_requests/1"),
    ).toBeNull();
  });

  it("returns null for a GitHub URL that is not a PR", () => {
    expect(
      parsePrUrl("https://github.com/facebook/react/issues/123"),
    ).toBeNull();
  });

  it("returns null for plain text", () => {
    expect(parsePrUrl("not a url at all")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(parsePrUrl("")).toBeNull();
  });
});
