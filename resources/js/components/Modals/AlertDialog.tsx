import { AlertDialogProps } from "@/interfaces/common";
import React from "react";
import { Button } from "@/components/UI/button";

const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen,
    title,
    message,
    icon,
    onConfirm,
    onCancel,
    confirmText = "OK",
    cancelText = "Cancel",
}) => {
    return (
        <div
            className={`fixed inset-0 ${isOpen ? "" : "hidden"}
         z-[1001] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm`}
        >
            <div
                className={`w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-950 ${
                    isOpen ? "animate-modal-open" : "animate-modal-close hidden"
                }`}
            >
                <div className="flex justify-center mb-4">
                    {icon && (
                        <span className="text-2xl">
                            <div dangerouslySetInnerHTML={{ __html: icon }} />
                        </span>
                    )}
                </div>
                <h2 className="mb-2 text-center text-lg font-semibold text-slate-950 dark:text-slate-50">
                    {title}
                </h2>
                <p className="mb-5 text-center text-sm text-slate-500 dark:text-slate-400">
                    {message}
                </p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        type="button"
                        className="w-full sm:w-auto"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;
