import AlertDialog from "@/components/Modals/AlertDialog";
import { Button } from "@/components/UI/button";
import { usePagination } from "@/hooks/usePagination";
import {
    IContactMessage,
    IContactMessageTable,
} from "@/interfaces/contactMessage";
import { setMenu } from "@/redux/slices/menuSlice";
import {
    deleteDataById,
    fetchData,
    getDataById,
    markAsRead,
} from "@/services/contactMessage";
import {
    IconEye,
    IconMail,
    IconMailOpened,
    IconSearch,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

const formatDate = (date: string) =>
    new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));

const ContactMessagePage = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState<IContactMessageTable>();
    const [selectedMessage, setSelectedMessage] =
        useState<IContactMessage | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [onProcess, setOnProcess] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const deleteId = useRef<number>(0);
    const openedQueryMessage = useRef<string | null>(null);
    const debounceTimeoutRef = useRef<number>();
    const [query, setQuery] = useState({
        page: 1,
        per_page: 10,
        search: "",
    });

    const pagination =
        usePagination({
            totalCount: data?.total,
            pageSize: data?.per_page,
            siblingCount: 1,
            currentPage: data?.current_page,
        }) ?? [];

    useEffect(() => {
        dispatch(setMenu("Messages"));
    }, [dispatch]);

    const loadData = () => {
        setOnProcess(true);
        fetchData(query)
            .then((res) => {
                setData({
                    data: res.data,
                    ...res.meta,
                });
            })
            .catch(() => {
                toast.error("Error when loading messages");
            })
            .finally(() => {
                setOnProcess(false);
            });
    };

    useEffect(() => {
        loadData();
    }, [query]);

    const handleChangePage = (page: number) => {
        if (!data || page < 1 || page > data.last_page) return;
        if (page === data.current_page) return;

        setQuery((current) => ({
            ...current,
            page,
        }));
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        window.clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = window.setTimeout(() => {
            setQuery((current) => ({
                ...current,
                page: 1,
                search: value,
            }));
        }, 500);
    };

    const handleView = (id: number) => {
        setIsDetailOpen(true);
        setSelectedMessage(null);

        toast
            .promise(getDataById(id), {
                loading: "Loading message...",
                success: "Message loaded",
                error: "Failed to load message",
            })
            .then((res) => {
                setSelectedMessage(res.data);

                if (!res.data.read_at) {
                    markAsRead(id)
                        .then((readRes) => {
                            setSelectedMessage(readRes.data);
                            loadData();
                        })
                        .catch(() => null);
                }
            })
            .catch(() => null);
    };

    useEffect(() => {
        const messageId = searchParams.get("message");
        if (!messageId || openedQueryMessage.current === messageId) return;

        openedQueryMessage.current = messageId;
        handleView(Number(messageId));
        setSearchParams({}, { replace: true });
    }, [searchParams, setSearchParams]);

    const handleDelete = () => {
        setOnProcess(true);
        toast
            .promise(deleteDataById(deleteId.current), {
                loading: "Deleting message...",
                success: "Message has been deleted",
                error: "Error when deleting message",
            })
            .then(() => {
                setIsDialogOpen(false);
                loadData();
            })
            .catch(() => {
                setOnProcess(false);
            });
    };

    return (
        <>
            <AlertDialog
                isOpen={isDialogOpen}
                title="Are you sure?"
                message="Do you really want to delete this message? This process cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setIsDialogOpen(false)}
                confirmText="Yes, delete it!"
                cancelText="No, cancel!"
            />

            {isDetailOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="admin-panel max-h-[90vh] w-full max-w-2xl overflow-hidden">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:p-6">
                            <div className="min-w-0">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Contact Message
                                </p>
                                <h3 className="mt-1 truncate text-lg font-semibold text-slate-950 dark:text-slate-50">
                                    {selectedMessage?.subject || "No subject"}
                                </h3>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Close message detail"
                                onClick={() => setIsDetailOpen(false)}
                            >
                                <IconX size={18} />
                            </Button>
                        </div>

                        <div className="max-h-[calc(90vh-5rem)] overflow-y-auto p-4 sm:p-6">
                            {!selectedMessage && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Loading...
                                </p>
                            )}

                            {selectedMessage && (
                                <div className="space-y-5">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                Name
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-slate-950 dark:text-slate-50">
                                                {selectedMessage.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                Email
                                            </p>
                                            <a
                                                href={`mailto:${selectedMessage.email}`}
                                                className="mt-1 block break-words text-sm font-medium text-primary"
                                            >
                                                {selectedMessage.email}
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                Received
                                            </p>
                                            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                                                {formatDate(selectedMessage.created_at)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                Status
                                            </p>
                                            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                                                {selectedMessage.read_at
                                                    ? "Read"
                                                    : "Unread"}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            Message
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                <div className="admin-panel overflow-hidden">
                    <div className="admin-panel-header">
                        <h3 className="admin-panel-title">Contact Messages</h3>
                    </div>

                    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {data?.total ?? 0} messages
                        </p>
                        <label className="relative block w-full sm:max-w-xs">
                            <IconSearch
                                size={16}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={handleSearch}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
                            />
                        </label>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[840px] text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                <tr>
                                    <th className="w-16 px-4 py-3 font-medium">
                                        No
                                    </th>
                                    <th className="px-4 py-3 font-medium">From</th>
                                    <th className="px-4 py-3 font-medium">
                                        Subject
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Message
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Received
                                    </th>
                                    <th className="w-36 px-4 py-3 font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {!onProcess &&
                                    data?.data.map((message, index) => (
                                        <tr
                                            key={message.id}
                                            className="bg-white transition-colors hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900/70"
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">
                                                {(data.current_page - 1) *
                                                    data.per_page +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                                                        {message.read_at ? (
                                                            <IconMailOpened size={16} />
                                                        ) : (
                                                            <IconMail size={16} />
                                                        )}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium text-slate-950 dark:text-slate-50">
                                                            {message.name}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                                            {message.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="max-w-[14rem] px-4 py-3 text-slate-600 dark:text-slate-300">
                                                <span className="line-clamp-2 break-words">
                                                    {message.subject || "No subject"}
                                                </span>
                                            </td>
                                            <td className="max-w-[18rem] px-4 py-3 text-slate-600 dark:text-slate-300">
                                                <span className="line-clamp-2 break-words">
                                                    {message.message}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                {formatDate(message.created_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleView(message.id)
                                                        }
                                                    >
                                                        <IconEye size={14} />
                                                        View
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            deleteId.current =
                                                                message.id;
                                                            setIsDialogOpen(true);
                                                        }}
                                                    >
                                                        <IconTrash size={14} />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                {!onProcess && data?.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                                        >
                                            No messages available
                                        </td>
                                    </tr>
                                )}
                                {onProcess && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Page {data?.current_page ?? 1} of{" "}
                            {data?.last_page ?? 1}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handleChangePage((data?.current_page ?? 1) - 1)
                                }
                                disabled={!data || data.current_page === 1}
                            >
                                Previous
                            </Button>
                            {pagination.map((page, index) => (
                                <Button
                                    type="button"
                                    key={index}
                                    variant={
                                        page === data?.current_page
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => handleChangePage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handleChangePage((data?.current_page ?? 1) + 1)
                                }
                                disabled={!data || data.current_page === data.last_page}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactMessagePage;
