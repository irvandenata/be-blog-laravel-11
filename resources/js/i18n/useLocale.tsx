import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dictionary, {
  DEFAULT_LOCALE,
  Locale,
  TranslationKey,
} from "./dictionary";

/**
 * The URL is the single source of truth for locale: "/" is Indonesian,
 * "/en/*" is English. Nothing is persisted, so a shared link always renders
 * the language it points at and there is no stored preference to contradict it.
 */
const EN_PREFIX = "/en";

export const localeFromPath = (pathname: string): Locale =>
  pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)
    ? "en"
    : DEFAULT_LOCALE;

/** Path with any locale prefix removed, always leading-slashed. */
export const stripLocale = (pathname: string): string => {
  if (pathname === EN_PREFIX) return "/";
  if (pathname.startsWith(`${EN_PREFIX}/`)) {
    return pathname.slice(EN_PREFIX.length) || "/";
  }
  return pathname || "/";
};

/** Prefix a locale-less path for the given locale. */
export const localizePath = (path: string, locale: Locale): string => {
  const bare = stripLocale(path.startsWith("/") ? path : `/${path}`);
  if (locale === DEFAULT_LOCALE) return bare;
  return bare === "/" ? EN_PREFIX : `${EN_PREFIX}${bare}`;
};

export function useLocale() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();

  const locale = localeFromPath(pathname);

  const t = useCallback(
    (key: TranslationKey): string =>
      dictionary[locale][key] ?? dictionary[DEFAULT_LOCALE][key] ?? key,
    [locale],
  );

  /** Build an href in the current locale — use for every internal link. */
  const localePath = useCallback(
    (path: string) => localizePath(path, locale),
    [locale],
  );

  /** Same page, other language. Keeps hash and query so context survives. */
  const switchLocale = useCallback(
    (next: Locale) => {
      navigate(`${localizePath(pathname, next)}${search}${hash}`);
    },
    [navigate, pathname, search, hash],
  );

  return useMemo(
    () => ({ locale, t, localePath, switchLocale }),
    [locale, t, localePath, switchLocale],
  );
}
