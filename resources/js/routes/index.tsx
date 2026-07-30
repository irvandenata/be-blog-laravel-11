import { lazy, ReactNode, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/Landing";
import { checkAuthLoader, ifLogin, logout } from "@/utils/auth";
import MainLayout from "@/components/Layouts/MainLayout";
import ErrorPage from "@/pages/Error";
import { middlewareLoader } from "@/utils/middleware";
import SearchArticlePage from "@/pages/Blog/SearchArticle";
import ArticleDetailPage from "@/pages/Blog/ArticleDetail";
import NotFoundPage from "@/pages/404";
import AboutPage from "@/pages/About";

/**
 * Admin screens are lazy so the WYSIWYG editor (draft-js and friends, several
 * hundred KB) never reaches public blog visitors. Public routes stay eager —
 * they are the LCP path.
 */
const AdminLayout = lazy(() => import("../components/Layouts/AdminLayout"));
const LoginPage = lazy(() => import("../pages/Auth/Login"));
const DashboardPage = lazy(() => import("../pages/Admin/Dashboard"));
const SettingPage = lazy(() => import("../pages/Admin/Setting"));
const SeoPage = lazy(() => import("../pages/Admin/Seo"));
const CustomInformationPage = lazy(
  () => import("../pages/Admin/CustomInformation"),
);
const ArticleCategoryPage = lazy(
  () => import("../pages/Admin/ArticleCategory"),
);
const ArticlePage = lazy(() => import("../pages/Admin/Article"));
const ArticleTagPage = lazy(() => import("../pages/Admin/ArticleTag"));
const CustomInformationTypePage = lazy(
  () => import("../pages/Admin/CustomInformationType"),
);
const ContactMessagePage = lazy(() => import("@/pages/Admin/ContactMessage"));
const AdminAboutPage = lazy(() => import("@/pages/Admin/About"));

const PageFallback = () => (
  <div className="grid min-h-[50vh] place-content-center text-sm text-slate-500 dark:text-slate-400">
    Loading...
  </div>
);

const deferred = (node: ReactNode) => (
  <Suspense fallback={<PageFallback />}>{node}</Suspense>
);
/**
 * The public tree is mounted twice: once at "/" (Indonesian, the default) and
 * once at "/en" (English). Built from one factory so a route can never exist in
 * one language but not the other. Locale itself is read from the URL by
 * useLocale, so the elements are identical between mounts.
 */
const publicRoutes = () => [
  { index: true, element: <LandingPage /> },
  { path: "not-found", element: <NotFoundPage /> },
  { path: "about", element: <AboutPage /> },
  {
    path: "login",
    element: deferred(<LoginPage />),
    loader: ifLogin,
  },
  {
    path: "logout",
    loader: logout,
    element: <></>,
  },
  {
    path: "blogs",
    children: [
      { path: "", element: <SearchArticlePage /> },
      { path: ":slug", element: <ArticleDetailPage /> },
    ],
  },
];

export default createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: publicRoutes(),
    },
    {
      path: "/en",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: publicRoutes(),
    },
    {
      path: "admin",
      element: deferred(<AdminLayout />),
      errorElement: <ErrorPage />,
      loader: checkAuthLoader,
      action: () => {
        return null;
      },
      children: [
        {
          path: "dashboard",
          element: deferred(<DashboardPage />),
          loader: middlewareLoader,
        },
        {
          path: "settings",
          element: deferred(<SettingPage />),
          loader: middlewareLoader,
        },
        {
          path: "settings/seo",
          element: deferred(<SeoPage />),
          loader: middlewareLoader,
        },
        {
          path: "contact-messages",
          element: deferred(<ContactMessagePage />),
          loader: middlewareLoader,
        },
        {
          path: "about",
          element: deferred(<AdminAboutPage />),
          loader: middlewareLoader,
        },
        {
          path: "custom-informations/items",
          element: deferred(<CustomInformationPage />),
          loader: middlewareLoader,
        },
        {
          path: "custom-informations/types",
          element: deferred(<CustomInformationTypePage />),
          loader: middlewareLoader,
        },

        {
          path: "article",
          loader: middlewareLoader,
          children: [
            {
              path: "posts",
              element: deferred(<ArticlePage />),
            },
            {
              path: "categories",
              element: deferred(<ArticleCategoryPage />),
            },
            {
              path: "tags",
              element: deferred(<ArticleTagPage />),
            },
          ],
        },
      ],
    },
  ],
  {},
);
