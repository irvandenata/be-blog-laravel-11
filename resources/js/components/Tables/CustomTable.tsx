import { ICustomInformation } from "@/interfaces/customInformation";
import { usePagination } from "@/hooks/usePagination";
import { useRef, useState } from "react";
import { CustomTableProps } from "@/interfaces/common";
import AlertDialog from "../Modals/AlertDialog";
import { useDispatch } from "react-redux";
import { openModal as openModalImage } from "@/redux/slices/imageModalSlice";
import { Button } from "@/components/UI/button";
import { cn } from "@/utils/aceternity";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";

export const CustomTable: React.FC<CustomTableProps> = ({
    fieldTable,
    data,
    onProccess,
    onDelete,
    onEdit,
    setQuery,
    query,
    children,
}) => {
    const pagination =
        usePagination({
            totalCount: data?.total,
            pageSize: data?.per_page,
            siblingCount: 1,
            currentPage: data?.current_page,
        }) ?? [];

    const dispatch = useDispatch();

    const handleChangePage = (page: number) => {
        if (!data || page < 1 || page > data.last_page) return;
        if (page === data.current_page) return;
        setQuery({
            ...query,
            page,
        });
    };

    const debounceTimeoutRef = useRef<any>();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(() => {
            setQuery({
                ...query,
                page: 1,
                search: value,
            });
        }, 500);
    };

    const deleteId = useRef<number>(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = () => {
        onDelete!(deleteId.current);
        setIsDialogOpen(false);
    };

    return (
        <div>
            <AlertDialog
                isOpen={isDialogOpen}
                title="Are you sure?"
                message="Do you really want to delete this item? This process cannot be undone."
                icon='<?xml version="1.0" ?><svg baseProfile="tiny"
                color="#FEA80B" fill="#FEA80B"
                height="80px" width="80px" id="Layer_1" version="1.2" viewBox="0 0 24 24"  xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M21.171,15.398l-5.912-9.854C14.483,4.251,13.296,3.511,12,3.511s-2.483,0.74-3.259,2.031l-5.912,9.856  c-0.786,1.309-0.872,2.705-0.235,3.83C3.23,20.354,4.472,21,6,21h12c1.528,0,2.77-0.646,3.406-1.771  C22.043,18.104,21.957,16.708,21.171,15.398z M12,17.549c-0.854,0-1.55-0.695-1.55-1.549c0-0.855,0.695-1.551,1.55-1.551  s1.55,0.696,1.55,1.551C13.55,16.854,12.854,17.549,12,17.549z M13.633,10.125c-0.011,0.031-1.401,3.468-1.401,3.468  c-0.038,0.094-0.13,0.156-0.231,0.156s-0.193-0.062-0.231-0.156l-1.391-3.438C10.289,9.922,10.25,9.712,10.25,9.5  c0-0.965,0.785-1.75,1.75-1.75s1.75,0.785,1.75,1.75C13.75,9.712,13.711,9.922,13.633,10.125z"/></svg>'
                onConfirm={handleDelete}
                onCancel={() => setIsDialogOpen(false)}
                confirmText="Yes, delete it!"
                cancelText="No, cancel!"
            />

            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {children}
                </div>
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
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                        <tr>
                            <th scope="col" className="w-16 px-4 py-3 font-medium">
                                No
                            </th>
                            {fieldTable.map((field: any, index: any) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className="px-4 py-3 font-medium"
                                >
                                    {field.name}
                                </th>
                            ))}
                            <th scope="col" className="w-36 px-4 py-3 font-medium">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {!onProccess &&
                            data?.data.map(
                                (field: ICustomInformation, index: number) => (
                                    <tr
                                        key={field.id ?? index}
                                        className="bg-white transition-colors hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900/70"
                                    >
                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">
                                            {(data.current_page - 1) *
                                                data.per_page +
                                                index +
                                                1}
                                        </td>
                                        {fieldTable.map((value: any, index: number) => {
                                            const cell =
                                                field[
                                                    value.field as keyof ICustomInformation
                                                ];

                                            return (
                                                <td
                                                    key={index}
                                                    className="max-w-[18rem] px-4 py-3 text-slate-600 dark:text-slate-300"
                                                >
                                                    {value.type === "image" ? (
                                                        cell ? (
                                                            <img
                                                                onClick={() =>
                                                                    dispatch(
                                                                        openModalImage({
                                                                            imageUrl: cell as string,
                                                                        })
                                                                    )
                                                                }
                                                                src={`${cell}`}
                                                                alt={`${cell}`}
                                                                className="h-11 w-11 cursor-zoom-in rounded-md object-cover"
                                                            />
                                                        ) : (
                                                            "-"
                                                        )
                                                    ) : (
                                                        <span className="line-clamp-2 break-words">
                                                            {cell ?? "N/A"}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        onEdit ? onEdit(field.id) : null
                                                    }
                                                >
                                                    <IconEdit size={14} />
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (!onDelete) return;
                                                        deleteId.current = field.id;
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    <IconTrash size={14} />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        {!onProccess && data?.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={fieldTable.length + 2}
                                    className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                        {onProccess && (
                            <tr>
                                <td
                                    colSpan={fieldTable.length + 2}
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
                    Page {data?.current_page ?? 1} of {data?.last_page ?? 1}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangePage((data?.current_page ?? 1) - 1)}
                        disabled={!data || data.current_page === 1}
                    >
                        Previous
                    </Button>
                    {pagination.map((page, index) => (
                        <Button
                            type="button"
                            key={index}
                            variant={page === data?.current_page ? "default" : "outline"}
                            size="sm"
                            className={cn("min-w-9 px-3")}
                            onClick={() => handleChangePage(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangePage((data?.current_page ?? 1) + 1)}
                        disabled={!data || data.current_page === data.last_page}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomTable;
