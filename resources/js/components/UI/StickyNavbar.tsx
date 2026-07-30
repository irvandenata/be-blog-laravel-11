import { setActiveMenu } from "@/redux/slices/landingSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import useColorMode from "@/hooks/useColorMode";
import { useLocale } from "@/i18n/useLocale";
import { stripLocale } from "@/i18n/useLocale";

export default function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);

  const activeMenu = useSelector((state: any) => state.landing.activeMenu);
  // Shares the "color-theme" storage key with the admin switcher and the
  // pre-paint script in app.blade.php, so the choice survives reloads.
  const [colorMode, setColorMode] = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useDispatch();
  const { t, locale, localePath, switchLocale } = useLocale();
  const { pathname } = useLocation();
  // Section links only scroll on the landing page; from any other page they
  // have to navigate home first.
  const isLanding = stripLocale(pathname) === "/";
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const handleClickTheme = () => {
    // useColorMode applies the html.dark class and persists the choice.
    setColorMode(isDark ? "light" : "dark");
  };

  // function for direct to the section
  const handleDirectToSection = (id: string) => {
    openNav ? setOpenNav(false) : null;
    // Off the landing page there is no section to scroll to; let the Link
    // navigate and the landing page handle the hash on arrival.
    if (isLanding) {
      const element = document.getElementById(id);
      element?.scrollIntoView({
        behavior: "smooth",
      });
    }
    dispatch(setActiveMenu(id));
  };

  // Section links live on the landing page; About and Blogs are real routes.
  const sections = [
    { id: "home", label: t("nav.home") },
    { id: "work-experience", label: t("nav.workExperience") },
    { id: "tech-stack", label: t("nav.techStack") },
    { id: "projects", label: t("nav.projects") },
    { id: "get-in-touch", label: t("nav.getInTouch") },
  ];

  const linkClass = (isActive: boolean) =>
    "flex items-center px-2 py-1 rounded-lg hover:bg-primary hover:text-white " +
    (isActive ? "bg-primary text-white" : "");

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-2">
      {sections.map((section) => (
        <li key={section.id} className=" dark:text-white font-normal">
          <Link
            to={localePath(`/#${section.id}`)}
            onClick={() => handleDirectToSection(section.id)}
            className={linkClass(activeMenu === section.id)}
          >
            {section.label}
          </Link>
        </li>
      ))}
      <li className=" dark:text-white font-normal">
        <Link
          to={localePath("/about")}
          onClick={() => {
            openNav ? setOpenNav(false) : null;
            dispatch(setActiveMenu("about"));
          }}
          className={linkClass(activeMenu === "about")}
        >
          {t("nav.about")}
        </Link>
      </li>
      <li className=" dark:text-white font-normal">
        <Link
          to={localePath("/blogs")}
          onClick={() => {
            openNav ? setOpenNav(false) : null;
            dispatch(setActiveMenu("blogs"));
          }}
          className={linkClass(activeMenu === "blogs")}
        >
          {t("nav.blogs")}
        </Link>
      </li>
    </ul>
  );

  // Two locales, so one button toggles rather than opening a menu. The label
  // shows the language currently active; clicking switches to the other one.
  const languageToggle = (
    <button
      type="button"
      onClick={() => switchLocale(locale === "en" ? "id" : "en")}
      aria-label={t("nav.switchLanguage")}
      title={t("nav.switchLanguage")}
      className="text-dark dark:text-white hover:bg-slate-200 dark:outline dark:outline-slate-500
                 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-200
                 rounded-lg text-sm font-semibold px-2.5 py-2 uppercase"
    >
      {locale === "en" ? "EN" : "ID"}
    </button>
  );

  return (
    <nav className="absolute top-0 z-10 w-full  max-w-full dark:border-dark dark:bg-dark bg-white  dark:text-white rounded-none px-4 py-2 lg:px-8 lg:py-4">
      <div className="flex items-center dark:text-white justify-between text-blue-gray-900">
        <Link
          to={localePath("/")}
          onClick={() => dispatch(setActiveMenu("home"))}
          className="mr-4 w-auto flex items-center cursor-pointer py-1.5 font-medium"
        >
          <img
            src="/logo.png"
            alt="IVD"
            width={24}
            height={24}
            className="w-6 h-6 dark:invert"
          />
          &nbsp; IVD
        </Link>

        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          {languageToggle}
          <div
            id="theme-toggle"
            onClick={handleClickTheme}
            className="text-dark cursor-pointer dark:text-white 
                            hover:bg-slate-200 dark:outline dark:outline-slate-500 
                            dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg text-sm p-2.5"
          >
            <svg
              id="theme-toggle-dark-icon"
              className={`w-4 h-4 ${isDark ? "hidden" : ""}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
            <svg
              id="theme-toggle-light-icon"
              className={`w-4 h-4 ${isDark ? "" : "hidden"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <button
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          {/* Mobile Nav */}
          <div
            className={`${
              openNav ? "block" : "hidden"
            } lg:hidden absolute top-0 left-0 w-full h-full bg-white dark:bg-dark dark:text-white
                        
                            animate-fade-in-down animate-duration-300 animate-ease-in-out
                        `}
          >
            <div className="flex flex-col  bg-white dark:bg-dark dark:text-white text-dark items-center justify-center h-screen">
              {navList}
            </div>

            <button
              className="absolute top-0 right-0 mt-4 mr-4 h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent"
              onClick={() => setOpenNav(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
