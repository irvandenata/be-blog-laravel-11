/**
 * Mirrors the EDITABLE keys in App\Http\Controllers\Api\SeoSettingController.
 * Values are stored as strings; ai_crawlers_allowed uses "1" / "0".
 */
export interface ISeoSetting {
  site_name: string;
  site_url: string;
  default_title: string;
  title_template: string;
  default_description: string;
  default_keywords: string;
  default_og_image: string;
  twitter_handle: string;
  author_name: string;
  author_url: string;
  locale: string;
  robots_default: string;
  google_site_verification: string;
  bing_site_verification: string;
  blog_title: string;
  blog_description: string;
  ai_crawlers_allowed: string;
}
