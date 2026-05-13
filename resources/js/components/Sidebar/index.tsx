import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    IconArticle,
    IconCategory,
    IconChevronDown,
    IconCircleDot,
    IconInfoSquareRounded,
    IconLayoutDashboard,
    IconSettings,
    IconTags,
    IconX,
} from "@tabler/icons-react";
import { cn } from "@/utils/aceternity";
import { Button } from "@/components/UI/button";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
    {
        label: "Main",
        items: [
            {
                label: "Dashboard",
                to: "/admin/dashboard",
                icon: IconLayoutDashboard,
            },
            {
                label: "Article",
                icon: IconArticle,
                match: "admin/article",
                children: [
                    { label: "Post", to: "/admin/article/posts", icon: IconCircleDot },
                    {
                        label: "Category",
                        to: "/admin/article/categories",
                        icon: IconCategory,
                    },
                    { label: "Tag", to: "/admin/article/tags", icon: IconTags },
                ],
            },
            {
                label: "Custom Information",
                icon: IconInfoSquareRounded,
                match: "custom-informations",
                children: [
                    {
                        label: "Main",
                        to: "/admin/custom-informations/items",
                        icon: IconCircleDot,
                    },
                    {
                        label: "Types",
                        to: "/admin/custom-informations/types",
                        icon: IconCircleDot,
                    },
                ],
            },
        ],
    },
    {
        label: "Workspace",
        items: [
            {
                label: "Settings",
                to: "/admin/settings",
                icon: IconSettings,
            },
        ],
    },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const { pathname } = useLocation();
    const sidebar = useRef<HTMLElement | null>(null);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current) return;
            if (!sidebarOpen || sidebar.current.contains(target as Node)) return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    }, [sidebarOpen, setSidebarOpen]);

    useEffect(() => {
        const keyHandler = ({ key }: KeyboardEvent) => {
            if (sidebarOpen && key === "Escape") setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    }, [sidebarOpen, setSidebarOpen]);

    useEffect(() => {
        setOpenGroups((current) => ({
            ...current,
            article: pathname.includes("admin/article") || current.article,
            "custom information":
                pathname.includes("custom-informations") ||
                current["custom information"],
        }));
    }, [pathname]);

    const closeMobileSidebar = () => {
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    const baseLink =
        "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors";
    const inactiveLink =
        "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50";
    const activeLink =
        "bg-slate-950 text-white shadow-sm dark:bg-slate-50 dark:text-slate-950";

    return (
        <aside
            ref={sidebar}
            className={cn(
                "fixed inset-y-0 left-0 z-999 flex w-[18rem] max-w-[86vw] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
                <NavLink
                    to="/admin/dashboard"
                    className="flex items-center gap-3"
                    onClick={closeMobileSidebar}
                >
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-sm font-bold text-white">
                        I
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                            IVD Admin
                        </span>
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                            Blog Management
                        </span>
                    </span>
                </NavLink>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                >
                    <IconX size={18} />
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {menuGroups.map((group) => (
                    <div key={group.label} className="mb-6">
                        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {group.label}
                        </p>
                        <ul className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const groupKey = item.label.toLowerCase();
                                const groupActive = item.match
                                    ? pathname.includes(item.match)
                                    : pathname === item.to;

                                if (item.children) {
                                    const open = openGroups[groupKey] ?? groupActive;
                                    return (
                                        <li key={item.label}>
                                            <button
                                                type="button"
                                                className={cn(
                                                    baseLink,
                                                    "w-full justify-between",
                                                    groupActive ? activeLink : inactiveLink
                                                )}
                                                onClick={() =>
                                                    setOpenGroups((current) => ({
                                                        ...current,
                                                        [groupKey]: !open,
                                                    }))
                                                }
                                            >
                                                <span className="flex min-w-0 items-center gap-3">
                                                    <Icon size={18} className="shrink-0" />
                                                    <span className="truncate">{item.label}</span>
                                                </span>
                                                <IconChevronDown
                                                    size={16}
                                                    className={cn(
                                                        "shrink-0 transition-transform",
                                                        open && "rotate-180"
                                                    )}
                                                />
                                            </button>
                                            {open && (
                                                <ul className="mt-1 space-y-1 pl-4">
                                                    {item.children.map((child) => {
                                                        const ChildIcon = child.icon;
                                                        return (
                                                            <li key={child.to}>
                                                                <NavLink
                                                                    to={child.to}
                                                                    onClick={closeMobileSidebar}
                                                                    className={({ isActive }) =>
                                                                        cn(
                                                                            baseLink,
                                                                            "h-9 text-sm",
                                                                            isActive
                                                                                ? activeLink
                                                                                : inactiveLink
                                                                        )
                                                                    }
                                                                >
                                                                    <ChildIcon
                                                                        size={14}
                                                                        className="shrink-0"
                                                                    />
                                                                    <span className="truncate">
                                                                        {child.label}
                                                                    </span>
                                                                </NavLink>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.to}>
                                        <NavLink
                                            to={item.to}
                                            onClick={closeMobileSidebar}
                                            className={({ isActive }) =>
                                                cn(
                                                    baseLink,
                                                    isActive ? activeLink : inactiveLink
                                                )
                                            }
                                        >
                                            <Icon size={18} className="shrink-0" />
                                            <span className="truncate">{item.label}</span>
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
