/**
 * Self-check for the locale path helpers — the one piece of i18n logic with
 * real branching. Run: node resources/js/i18n/locale.test.mjs
 *
 * Mirrors useLocale.tsx; kept dependency-free so it runs without a test
 * framework or a TypeScript transform (the repo has neither).
 */
import assert from "node:assert/strict";

const EN_PREFIX = "/en";
const DEFAULT_LOCALE = "id";

const localeFromPath = (pathname) =>
  pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)
    ? "en"
    : DEFAULT_LOCALE;

const stripLocale = (pathname) => {
  if (pathname === EN_PREFIX) return "/";
  if (pathname.startsWith(`${EN_PREFIX}/`)) {
    return pathname.slice(EN_PREFIX.length) || "/";
  }
  return pathname || "/";
};

const localizePath = (path, locale) => {
  const bare = stripLocale(path.startsWith("/") ? path : `/${path}`);
  if (locale === DEFAULT_LOCALE) return bare;
  return bare === "/" ? EN_PREFIX : `${EN_PREFIX}${bare}`;
};

// Detection
assert.equal(localeFromPath("/"), "id");
assert.equal(localeFromPath("/blogs"), "id");
assert.equal(localeFromPath("/en"), "en");
assert.equal(localeFromPath("/en/blogs"), "en");
// "/energy" must not read as English just because it starts with "en".
assert.equal(localeFromPath("/energy"), "id");
assert.equal(localeFromPath("/entries/foo"), "id");

// Stripping
assert.equal(stripLocale("/en"), "/");
assert.equal(stripLocale("/en/blogs/my-post"), "/blogs/my-post");
assert.equal(stripLocale("/blogs"), "/blogs");
assert.equal(stripLocale("/energy"), "/energy");

// Building
assert.equal(localizePath("/", "id"), "/");
assert.equal(localizePath("/", "en"), "/en");
assert.equal(localizePath("/blogs", "en"), "/en/blogs");
assert.equal(localizePath("/blogs", "id"), "/blogs");
// Idempotent: re-localizing an already-prefixed path must not double up.
assert.equal(localizePath("/en/blogs", "en"), "/en/blogs");
assert.equal(localizePath("/en/blogs", "id"), "/blogs");
// Round trip through both languages returns the original.
assert.equal(localizePath(localizePath("/blogs", "en"), "id"), "/blogs");
assert.equal(localizePath("blogs", "en"), "/en/blogs");

console.log("locale helpers: all assertions passed");
