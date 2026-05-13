import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ImageDetailModal from "../Modals/ImageDetailModal";
import { useDispatch } from "react-redux";
import { resetModal} from "@/redux/slices/imageModalSlice";
import { cn } from "@/utils/aceternity";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    return (
        <>
            <Toaster
                toastOptions={{
                    className:
                        "dark:bg-dark-custom-200 dark:text-white text-sm z-[9999]",
                    style: {
                        zIndex: 9999,
                    },
                }}
            />
            <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
                <div className="flex min-h-screen">
                    <button
                        type="button"
                        aria-label="Close sidebar overlay"
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                            "fixed inset-0 z-[998] bg-slate-950/45 backdrop-blur-sm transition-opacity lg:hidden",
                            sidebarOpen
                                ? "opacity-100"
                                : "pointer-events-none opacity-0"
                        )}
                    />
                    <Sidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    <div className="flex min-w-0 flex-1 flex-col">
                        <Header
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                        <main className="flex-1">
                            <div className="mx-auto w-full max-w-screen-2xl px-3 py-4 sm:px-4 md:px-6 lg:px-8">
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <ImageDetailModal
                onClose={() => {
                    dispatch(resetModal());
                }}
            >
                <h1>Image Detail Modal</h1>
            </ImageDetailModal>
        </>
    );
}

export default AdminLayout;
