import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  IconDeviceFloppy,
  IconExternalLink,
  IconRefresh,
} from "@tabler/icons-react";

import { Button } from "@/components/UI/button";
import { ISeoSetting } from "@/interfaces/seoSetting";
import { setMenu } from "@/redux/slices/menuSlice";
import { fetchSeoSettings, updateSeoSettings } from "@/services/seoSetting";

type FieldType = "text" | "textarea" | "toggle";

interface FieldDef {
  key: keyof ISeoSetting;
  label: string;
  hint?: string;
  type?: FieldType;
  placeholder?: string;
  /** Soft limit shown as a counter: where search results truncate. */
  limit?: number;
}

interface SectionDef {
  title: string;
  description: string;
  fields: FieldDef[];
}

const SECTIONS: SectionDef[] = [
  {
    title: "Site Identity",
    description:
      "Used across every page title, canonical URL, and social share card.",
    fields: [
      { key: "site_name", label: "Site Name", placeholder: "ivd.my.id" },
      {
        key: "site_url",
        label: "Site URL",
        hint: "No trailing slash. Builds canonical and sitemap URLs.",
        placeholder: "https://ivd.my.id",
      },
      {
        key: "default_title",
        label: "Default Title",
        hint: "Homepage title, and any page without its own.",
        limit: 60,
      },
      {
        key: "title_template",
        label: "Title Template",
        hint: "Must contain exactly one %s — replaced by the page title.",
        placeholder: "%s | ivd.my.id",
      },
      {
        key: "default_description",
        label: "Default Description",
        type: "textarea",
        hint: "Google truncates around 160 characters.",
        limit: 160,
      },
      {
        key: "default_keywords",
        label: "Default Keywords",
        type: "textarea",
        hint: "Comma separated.",
      },
      { key: "locale", label: "Locale", placeholder: "id_ID" },
    ],
  },
  {
    title: "Author & Social",
    description:
      "Feeds the Person schema, article bylines, and Twitter/X attribution.",
    fields: [
      { key: "author_name", label: "Author Name" },
      {
        key: "author_url",
        label: "Author URL",
        placeholder: "https://ivd.my.id",
      },
      {
        key: "twitter_handle",
        label: "Twitter / X Handle",
        placeholder: "@username",
      },
      {
        key: "default_og_image",
        label: "Default Share Image",
        hint: "1200×630. Leave empty to use the generated flat-design card.",
        placeholder: "https://ivd.my.id/og-default.svg",
      },
    ],
  },
  {
    title: "Blog Listing",
    description: "Metadata for the /blogs index page.",
    fields: [
      { key: "blog_title", label: "Blog Title", limit: 60 },
      {
        key: "blog_description",
        label: "Blog Description",
        type: "textarea",
        limit: 160,
      },
    ],
  },
  {
    title: "Indexing & AI",
    description:
      "Controls how search engines and AI crawlers may use the site.",
    fields: [
      {
        key: "robots_default",
        label: "Robots Directive",
        hint: "Applied to public pages. Admin and draft pages are always noindex.",
        placeholder: "index, follow, max-image-preview:large",
      },
      {
        key: "ai_crawlers_allowed",
        label: "Allow AI Crawlers",
        type: "toggle",
        hint: "Permits GPTBot, ClaudeBot, PerplexityBot and peers, so the site can be cited in AI answers.",
      },
      {
        key: "google_site_verification",
        label: "Google Verification Code",
        hint: "The content value from the google-site-verification meta tag.",
      },
      { key: "bing_site_verification", label: "Bing Verification Code" },
    ],
  },
];

const GENERATED_FILES = [
  { label: "robots.txt", href: "/robots.txt" },
  { label: "sitemap.xml", href: "/sitemap.xml" },
  { label: "llms.txt", href: "/llms.txt" },
  { label: "RSS feed", href: "/feed.xml" },
];

const SeoPage = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState<ISeoSetting | null>(null);
  const [savedData, setSavedData] = useState<ISeoSetting | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(setMenu("SEO"));
  }, [dispatch]);

  useEffect(() => {
    let isCurrent = true;

    fetchSeoSettings()
      .then((res) => {
        if (!isCurrent) return;
        setData(res.data);
        setSavedData(res.data);
      })
      .catch(() => {
        if (!isCurrent) return;
        toast.error("Failed to load SEO settings");
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const setField = (key: keyof ISeoSetting, value: string) => {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleReset = () => {
    setData(savedData);
    toast.success("Reverted to last saved values");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || isSaving) return;

    setIsSaving(true);
    try {
      const res = await toast.promise(updateSeoSettings(data), {
        loading: "Saving...",
        success: "SEO settings updated",
        error: (err) => err?.message ?? "Failed to update SEO settings",
      });
      setSavedData(res.data ?? data);
    } catch {
      // toast.promise already surfaced the message.
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="admin-panel p-6 text-sm text-slate-500 dark:text-slate-400">
        Loading SEO settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
      {SECTIONS.map((section) => (
        <section key={section.title} className="admin-panel overflow-hidden">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">{section.title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {section.description}
            </p>
          </div>

          <div className="admin-form">
            {section.fields.map((field) => (
              <SeoField
                key={field.key}
                field={field}
                value={data[field.key] ?? ""}
                onChange={(value) => setField(field.key, value)}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="admin-panel overflow-hidden">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Verify</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Generated files, refreshed automatically when you save.
          </p>
        </div>
        <div className="admin-form sm:grid-cols-2">
          {GENERATED_FILES.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-800 dark:text-slate-200"
            >
              {link.label}
              <IconExternalLink size={16} />
            </a>
          ))}
        </div>
      </section>

      <div className="admin-panel">
        <div className="admin-actions">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleReset}
            disabled={isSaving}
          >
            <IconRefresh size={16} />
            Reset
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSaving}
          >
            <IconDeviceFloppy size={16} />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};

interface SeoFieldProps {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}

const SeoField = ({ field, value, onChange }: SeoFieldProps) => {
  if (field.type === "toggle") {
    const isOn = value === "1";

    return (
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="admin-label mb-1">{field.label}</span>
          {field.hint && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {field.hint}
            </p>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isOn}
          aria-label={field.label}
          onClick={() => onChange(isOn ? "0" : "1")}
          className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${
            isOn ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              isOn ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    );
  }

  const isOver = field.limit ? value.length > field.limit : false;

  return (
    <div>
      <label className="admin-label" htmlFor={field.key}>
        {field.label}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={field.key}
          rows={3}
          className="admin-input"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={field.key}
          type="text"
          className="admin-input"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      <div className="mt-1 flex items-start justify-between gap-3">
        {field.hint ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {field.hint}
          </p>
        ) : (
          <span />
        )}
        {field.limit && (
          <span
            className={`shrink-0 text-xs tabular-nums ${
              isOver ? "text-red-500" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {value.length}/{field.limit}
          </span>
        )}
      </div>
    </div>
  );
};

export default SeoPage;
