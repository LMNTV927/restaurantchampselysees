import { describe, expect, it } from "bun:test";
import { canonicalUrl, isNoindexPath } from "../src/lib/seoRouting";

describe("canonical reference URLs", () => {
  it("keeps the homepage slash", () => {
    expect(canonicalUrl("/")).toBe("https://restaurantchampselysees.fr/");
  });
  it("removes trailing slashes and query parameters from other pages", () => {
    expect(canonicalUrl("/restaurant/?utm_source=test")).toBe("https://restaurantchampselysees.fr/restaurant");
  });
});

describe("private page indexing policy", () => {
  for (const path of ["/login", "/book/google-ads", "/reservation/modify/test-token", "/reservation/cancel/test-token", "/email-preview", "/email-preview-thankyou"]) {
    it(`prevents indexing ${path}`, () => expect(isNoindexPath(path)).toBe(true));
  }
  it("does not apply the private page policy to public articles", () => {
    expect(isNoindexPath("/afterwork-paris-champs-elysees")).toBe(false);
  });
});