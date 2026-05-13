import { ImageDetailModalProps } from "@/interfaces/common";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/UI/button";

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
    onSubmit,
    onClose,
    onUpdate,
}) => {
    const modal = useSelector((state: any) => state.imageModal);
    const handleSubmit = () => {
        onSubmit!();
    };
    return (
        <div
            className={`fixed inset-0 z-[1000] overflow-y-auto p-3 sm:p-6 ${
                 modal.isOpen ? "" : "hidden"
             }`}
        >
            <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"></div>
            <div
                className={`relative z-[1000] mx-auto my-4 flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 sm:my-10 ${
                    modal.isOpen ? "animate-modal-open" : "animate-modal-close"
                }`}
            >
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-6">
                    <h2 className="truncate text-base font-semibold text-slate-950 dark:text-slate-50">
                        {modal.title || "Image Preview"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-50"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <img
                        src={modal.imageUrl}
                        alt="image"
                        className="mx-auto max-h-[70vh] w-full rounded-md object-contain"
                    />
                </div>
                <div className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={modal.onProcess}
                        className="w-full sm:w-auto"
                    >
                        Close
                    </Button>
                    {onSubmit! &&
                        (modal.isUpdate ? (
                            <Button
                                type="button"
                                onClick={() => onUpdate!(modal!.keyId)}
                                disabled={modal.onProcess}
                                className="w-full sm:w-auto"
                            >
                                Update
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={modal.onProcess}
                                className="w-full sm:w-auto"
                            >
                                Save
                            </Button>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ImageDetailModal;
