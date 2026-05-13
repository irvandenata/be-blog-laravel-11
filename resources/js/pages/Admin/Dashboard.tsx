import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setMenu } from '@/redux/slices/menuSlice';
import {
    IconArticle,
    IconCategory,
    IconInfoSquareRounded,
    IconMail,
    IconSettings,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

const dashboardItems = [
    {
        title: "Posts",
        description: "Manage article content",
        to: "/admin/article/posts",
        icon: IconArticle,
    },
    {
        title: "Categories",
        description: "Organize article groups",
        to: "/admin/article/categories",
        icon: IconCategory,
    },
    {
        title: "Information",
        description: "Manage custom sections",
        to: "/admin/custom-informations/items",
        icon: IconInfoSquareRounded,
    },
    {
        title: "Settings",
        description: "Update landing content",
        to: "/admin/settings",
        icon: IconSettings,
    },
    {
        title: "Messages",
        description: "Review landing contact form messages",
        to: "/admin/contact-messages",
        icon: IconMail,
    },
];

const DashboardPage = () => {
   
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setMenu("Dashboard"));
    });
    
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardItems.map((item) => {
                const Icon = item.icon;

                return (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className="admin-panel p-4 transition-colors hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                        <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                            <Icon size={20} />
                        </div>
                        <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
                            {item.title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {item.description}
                        </p>
                    </NavLink>
                );
            })}
        </div>
    );
};

export default DashboardPage;
