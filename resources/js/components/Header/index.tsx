import { IconMenu2 } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/UI/button";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";

const Header = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) => {
    const menu = useSelector(
        (state: { menu: { name: string } }) => state.menu.name
    );

    return (
        <header className="sticky top-0 z-[997] border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
            <div className="flex h-16 items-center justify-between gap-3 px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 lg:hidden"
                        aria-controls="sidebar"
                        aria-expanded={Boolean(props.sidebarOpen)}
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                    >
                        <IconMenu2 size={18} />
                    </Button>

                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Admin
                        </p>
                        <h1 className="truncate text-base font-semibold text-slate-950 dark:text-slate-50 sm:text-lg">
                            {menu || "Dashboard"}
                        </h1>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <ul className="flex items-center gap-2">
                        <DarkModeSwitcher />
                        <DropdownNotification />
                    </ul>
                    <DropdownUser />
                </div>
            </div>
        </header>
    );
};

export default Header;
