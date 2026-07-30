import CommentCard from "@/components/Cards/CommentCard";
import { ArticleImagePlaceholder } from "@/components/UI/ArticleImagePlaceholder";
import { IArticle } from "@/interfaces/article";
import { SEOHead } from "@/hooks/useSEO";
import { setActiveMenu } from "@/redux/slices/landingSlice";
import { getDataBySlug, fetchDataNoAuth } from "@/services/article";
import { convertDate } from "@/utils/common";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/UI/moving-border";
import { useLocale } from "@/i18n/useLocale";

const ArticleDetailPage = () => {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const param = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, locale, localePath } = useLocale();

  useEffect(() => {
    if (!param.slug) {
      navigate(localePath("/not-found"));
      return;
    }

    setArticle(null);
    setArticles([]);
    let isCurrent = true;
    const cookie = document.cookie;
    let count = true;
    const flag = cookie
      .split(";")
      .find((item) => item.trim().startsWith("viwed-" + param.slug));
    if (flag) {
      count = false;
    }
    dispatch(setActiveMenu("blogs"));
    getDataBySlug(param.slug ?? "", count, locale)
      .then((res) => {
        if (!isCurrent) return;
        setArticle(res.data);
        const date = new Date();
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
        document.cookie = `viwed-${
          res.data.slug
        }=true; expires=${date.toUTCString()}; path=/`;
      })
      .catch((_) => {
        if (!isCurrent) return;
        navigate(localePath("/not-found"));
      });
    return () => {
      isCurrent = false;
    };
  }, [param.slug, navigate, dispatch, locale]);

  useEffect(() => {
    if (!article) return;
    let isCurrent = true;
    fetchDataNoAuth({
      page: 1,
      limit: 3,
      search_category_id: article.category?.id,
      locale,
    })
      .then((res) => {
        if (!isCurrent) return;
        if (article) {
          const relatedArticles = res.data.filter(
            (item: IArticle) => article.slug !== item.slug,
          );
          setArticles(relatedArticles.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error("Error fetching related articles:", err);
      });
    return () => {
      isCurrent = false;
    };
  }, [article, locale]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article?.slug]);

  const buildArticleStructuredData = (art: IArticle) => {
    const plainContent = art.content
      ? art.content
          .replace(/<[^>]*>/g, "")
          .slice(0, 300)
          .trim()
      : "";
    const description =
      art.meta_description || art.subtitle || plainContent || art.title;

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: art.title,
      description: description.slice(0, 160),
      // Matches the server-side fallback: the generated flat-design card.
      image: art.image_url
        ? [art.image_url]
        : [`${window.location.origin}/og/article/${art.slug}.svg`],
      datePublished: art.created_at,
      dateModified: art.updated_at || art.created_at,
      author: {
        "@type": "Person",
        name: "Denata",
        url: "https://ivd.my.id/",
      },
      publisher: {
        "@type": "Person",
        name: "Denata",
        url: "https://ivd.my.id/",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://ivd.my.id/blogs/${art.slug}`,
      },
      keywords: art.tags?.map((t) => t.name).join(", "),
      articleSection: art.category_name || art.category?.name,
      url: `https://ivd.my.id/blogs/${art.slug}`,
    };
  };

  const getSeoDescription = (art: IArticle): string => {
    if (art.meta_description) return art.meta_description.slice(0, 160);
    if (art.subtitle) return art.subtitle.slice(0, 160);
    const plain = art.content ? art.content.replace(/<[^>]*>/g, "").trim() : "";
    return plain.slice(0, 160) || art.title;
  };

  const getSeoKeywords = (art: IArticle): string => {
    const tags = art.tags?.map((t) => t.name) ?? [];
    if (art.meta_keywords) return art.meta_keywords;
    if (art.category_name) tags.unshift(art.category_name);
    return tags.join(", ");
  };

  return article ? (
    <>
      <SEOHead
        title={article.title}
        description={getSeoDescription(article)}
        keywords={getSeoKeywords(article)}
        image={article.image_url}
        url={localePath(`/blogs/${article.slug}`)}
        type="article"
        publishedTime={article.created_at}
        modifiedTime={article.updated_at}
        author="Denata"
        structuredData={buildArticleStructuredData(article)}
      />
      <div
        id="article"
        className="w-full min-h-screen relative z-10 dark:bg-dark bg-white  lg:pt-30 text-dark  dark:text-white"
      >
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4">{article?.title}</h1>
          <h2 className="text-lg font-medium mb-4">{article?.category_name}</h2>
          <div className="w-full flex justify-center">
            <p className="text-xs w-39 text-white dark:text-white font-bold p-1 rounded-lg bg-primary">
              {article
                ? convertDate(article?.created_at ?? "", "MMMM DD, YYYY")
                : ""}
            </p>
          </div>

          <div className="flex gap-4 justify-center mt-6">
            {article?.tags.map((tag, index) => (
              <div
                key={"tag-" + index}
                className="px-3 py-1 border border-yellow dark:text-white font-bold grid place-content-center rounded-lg"
              >
                <h3 className="text-xs align-middle">{tag.name}</h3>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-5">
            <div className="flex w-auto mx-auto rounded-xl mt-5 px-4 py-2 bg-boxdark text-center">
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 1024 1024"
                className="icon my-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 110 448 224 224 0 010-448zm0 64a160.192 160.192 0 00-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"
                />
              </svg>
              &nbsp;
              <p className="text-md my-auto text-white  font-bold rounded-xl">
                {article?.views} {t("blog.views")}
              </p>
            </div>
          </div>
        </div>
        <div
          id="article-image"
          className="w-full lg:px-5 md:px-5 lg:mb-20 mb:mb-20 mb-10  lg:h-[600px] md:h-[600px] animate-fade-on"
        >
          {article?.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full rounded-xl border-2 border-bodydark2 h-full object-cover"
            />
          ) : (
            <ArticleImagePlaceholder
              title={article.title}
              category={article.category_name ?? article.category?.name}
            />
          )}
        </div>
        <div className="w-full lg:px-60 ">
          {article.is_translated === false && (
            <p
              role="status"
              className="mb-6 rounded-lg border-2 border-yellow bg-slate-50 px-4 py-3 text-sm dark:bg-gray-dark"
            >
              {t("blog.translationNotice")}
            </p>
          )}
          <div
            className="prose-revert"
            style={{
              textAlign: "justify",
            }}
            dangerouslySetInnerHTML={{
              __html: article?.content ?? "",
            }}
          ></div>
        </div>

        <div
          id="article-related"
          className="w-full lg:px-60 relative grid place-content-center grid-cols-1 z-10 "
        >
          <div className="text-2xl py-10 text-center font-bold dark:text-white text-dark-custom-200">
            {t("blog.relatedArticles")}
          </div>
          <div className="w-full" id="projects-container">
            <div className="grid grid-cols-1 gap-4 ">
              {articles.map((item, index) => (
                <div key={index + "-projects"} className="lg:mx-6 ">
                  <div
                    className=""
                    style={{
                      transition: "transform 0.3s ease-in-out",
                    }}
                  >
                    <div
                      className="w-full hover:border-primary hover:scale-105 hover:cursor-pointer border-2 border-bodydark2 dark:border-slate-800 rounded-xl relative overflow-hidden"
                      onClick={() => {
                        navigate(localePath(`/blogs/${item.slug}`));
                      }}
                    >
                      <div className="place-items-start flex">
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-2 dark:text-white text-dark">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex mt-10">
              <div className="w-full text-center">
                <div>
                  <Button
                    onClick={() => {
                      navigate("/blogs");
                    }}
                    borderRadius="1.75rem"
                    className="bg-white px-10 py-2
                                            dark:hover:bg-primary
                                        dark:bg-slate-900 text-black font-extrabold dark:text-white border-neutral-200 dark:border-slate-800"
                  >
                    More Articles
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:pb-40 w-full mb:pb-40 pb-30 lg:px-60 mt-20">
          <CommentCard
            key={article.id}
            articleId={article.id.toString()}
            slug={article.slug ?? ""}
          />
        </div>
      </div>
    </>
  ) : (
    <div className="w-full min-h-screen relative z-10 dark:bg-dark text-white">
      <div className="w-full h-screen grid place-content-center  text-dark dark:text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          className="animate-spin"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"></path>
        </svg>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
