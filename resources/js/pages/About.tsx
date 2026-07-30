import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AnimateSection from "@/components/UI/AnimateSection";
import { SEOHead } from "@/hooks/useSEO";
import { useLocale } from "@/i18n/useLocale";
import { setActiveMenu } from "@/redux/slices/landingSlice";
import { fetchDataAbout } from "@/services/landing";
import { convertDate } from "@/utils/common";

interface AboutEntry {
    id: number;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    image_url?: string | null;
    start_date?: string | null;
    end_date?: string | null;
}

/**
 * Content is authored in the admin under custom informations (type "about"), so
 * the copy stays editable without a deploy. Rendering mirrors the work
 * experience section: an entry is a heading, an optional period, and prose.
 */
const AboutPage = () => {
    const dispatch = useDispatch();
    const { t, locale } = useLocale();

    const [entries, setEntries] = useState<AboutEntry[]>([]);
    const [isLoad, setIsLoad] = useState(true);

    useEffect(() => {
        dispatch(setActiveMenu("about"));
    }, [dispatch]);

    useEffect(() => {
        let active = true;
        setIsLoad(true);

        fetchDataAbout(locale)
            .then((res) => {
                if (!active) return;
                setEntries(res.data ?? []);
                setIsLoad(false);
            })
            .catch(() => {
                if (!active) return;
                // An empty About page is preferable to a broken one; the empty
                // state below explains itself.
                setEntries([]);
                setIsLoad(false);
            });

        // Guards against a locale switch mid-flight resolving out of order.
        return () => {
            active = false;
        };
    }, [locale]);

    const aboutStructuredData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: t("about.title"),
        description: t("about.subtitle"),
        url: `https://ivd.my.id${locale === "en" ? "/en" : ""}/about`,
        inLanguage: locale === "en" ? "en" : "id",
        mainEntity: {
            "@type": "Person",
            name: "Denata",
            url: "https://ivd.my.id/",
        },
    };

    return (
        <div id="about-content">
            <SEOHead
                title={t("about.seoTitle")}
                description={t("about.subtitle")}
                url={`${locale === "en" ? "/en" : ""}/about`}
                type="website"
                structuredData={aboutStructuredData}
            />

            <div
                id="about"
                className="flex flex-col items-center text-center text-dark dark:text-bodydark1 justify-center relative z-10 pt-40 pb-10"
            >
                <p className="bg-primary dark:text-white text-white py-1 px-2 mb-4 rounded-lg">
                    {t("about.badge")}
                </p>
                <h1 className="text-4xl">{t("about.title")}</h1>
                <p className="mt-2 max-w-2xl">{t("about.subtitle")}</p>
            </div>

            <div className="content relative z-10 mb-30 pb-20">
                <div className="mx-auto lg:w-3/4 md:w-3/4 w-full">
                    {entries.map((entry, index) => (
                        <AnimateSection
                            key={entry.id + "-about"}
                            id={"about-entry-" + entry.id}
                            parentId="about-content"
                            className={`bg-slate-50 dark:bg-dark border-gray-dark my-4 rounded-xl border-2 p-6 animate-fade-in delay-${
                                200 * index
                            }`}
                            inAnimate="animate-fade-in"
                            outAnimate=""
                            bottom={900}
                        >
                            <article className="lg:flex md:flex gap-6">
                                {entry.image_url && (
                                    <img
                                        src={entry.image_url}
                                        alt={entry.title}
                                        width={160}
                                        height={160}
                                        loading="lazy"
                                        className="h-40 w-40 rounded-xl object-cover mb-4 lg:mb-0 md:mb-0"
                                    />
                                )}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-dark dark:text-white">
                                        {entry.title}
                                    </h2>
                                    {entry.subtitle && (
                                        <p className="text-md font-semibold text-gray-500 dark:text-gray-400">
                                            {entry.subtitle}
                                        </p>
                                    )}
                                    {entry.start_date && (
                                        <time className="block mt-1 mb-2 text-sm font-semibold text-gray-400 dark:text-white">
                                            {convertDate(
                                                entry.start_date,
                                                "mm-yyyy"
                                            )}
                                            {entry.end_date
                                                ? ` - ${convertDate(
                                                      entry.end_date,
                                                      "mm-yyyy"
                                                  )}`
                                                : ""}
                                        </time>
                                    )}
                                    {entry.description && (
                                        <div
                                            className="text-sm font-thin text-gray-500 dark:text-white text-justify"
                                            dangerouslySetInnerHTML={{
                                                __html: entry.description,
                                            }}
                                        />
                                    )}
                                </div>
                            </article>
                        </AnimateSection>
                    ))}

                    {isLoad && (
                        <div className="flex justify-center py-10 text-dark dark:text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                className="animate-spin"
                                viewBox="0 0 512 512"
                                fill="currentColor"
                            >
                                <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"></path>
                            </svg>
                        </div>
                    )}

                    {!isLoad && entries.length === 0 && (
                        <p className="text-center text-lg font-bold text-dark dark:text-white py-10">
                            {t("about.empty")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
