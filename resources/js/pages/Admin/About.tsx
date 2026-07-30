import DynamicModal from "@/components/Modals/DynamicModal";
import CustomTable from "@/components/Tables/CustomTable";
import { ICustomInformationTable } from "@/interfaces/customInformation";
import { setMenu } from "@/redux/slices/menuSlice";
import {
    endProccess,
    setModal,
    startProccess,
} from "@/redux/slices/modalSlice";
import { openModal as openModalImage } from "@/redux/slices/imageModalSlice";
import {
    createData,
    deleteDataById,
    fetchData,
    getDataById,
    updateData,
} from "@/services/customInformations";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Button } from "@/components/UI/button";
import { IconPlus } from "@tabler/icons-react";

/**
 * Dedicated management screen for the public "Tentang Saya" page.
 *
 * Entries are stored in custom_informations like the tech stack and work
 * experience, but this screen pins information_type_id to the "about" type and
 * hides the fields that page never renders (icon, subtitle as a grouping key,
 * type picker). That keeps the About content out of the generic list, where it
 * would otherwise be mixed in with social links and tech-stack icons.
 */
const ABOUT_TYPE_ID = 4;

const AdminAbout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMenu("About"));
    }, [dispatch]);

    const [onProccess, setOnProccess] = useState(false);
    const [data, setData] = useState<ICustomInformationTable>();
    const [query, setQuery] = useState({
        page: 1,
        per_page: 10,
        sort: "asc",
        search: "",
        // Scopes every read to About entries only.
        search_type_id: ABOUT_TYPE_ID,
    });

    const [imageFile, setImageData] = useState<File>();
    const preview = useRef<any>();

    const titleField = useRef<any>("");
    const titleEnField = useRef<any>("");
    const subtitleField = useRef<any>("");
    const descriptionField = useRef<any>("");
    const descriptionEnField = useRef<any>("");
    const startDateField = useRef<any>("");
    const endDateField = useRef<any>("");
    const imageField = useRef<any>("");

    const loadData = () => {
        toast
            .promise(fetchData(query), {
                loading: "Loading...",
                success: "Data has been loaded",
                error: "Error when loading data",
            })
            .then((res) => {
                setData({ data: res.data, ...res.meta });
                setOnProccess(false);
            })
            .catch((err) => {
                toast.error(err.message);
                setOnProccess(false);
            });
    };

    useEffect(() => {
        if (!onProccess) {
            setOnProccess(true);
            loadData();
        }
    }, [query]);

    const clearFields = () => {
        titleField.current.value = "";
        titleEnField.current.value = "";
        subtitleField.current.value = "";
        descriptionField.current.value = "";
        descriptionEnField.current.value = "";
        startDateField.current.value = "";
        endDateField.current.value = "";
        imageField.current.value = "";
        setImageData(undefined);
        preview.current!.src = "";
        preview.current!.hidden = true;
    };

    const handleCreate = () => {
        clearFields();
        dispatch(setModal({ isOpen: true, title: "Tambah Konten Tentang Saya" }));
    };

    /** Shared by create and update so the two payloads cannot drift apart. */
    const buildFormData = () => {
        const formData = new FormData();
        formData.append("title", titleField.current.value);
        formData.append("title_en", titleEnField.current.value ?? "");
        formData.append("subtitle", subtitleField.current.value ?? "");
        formData.append("description", descriptionField.current.value ?? "");
        formData.append(
            "description_en",
            descriptionEnField.current.value ?? ""
        );
        formData.append("information_type_id", String(ABOUT_TYPE_ID));
        // Dates are optional here: a bio section has no period, a milestone does.
        if (startDateField.current.value) {
            formData.append("start_date", startDateField.current.value);
        }
        if (endDateField.current.value) {
            formData.append("end_date", endDateField.current.value);
        }
        if (imageFile) {
            formData.append("image", imageFile);
        }
        return formData;
    };

    const validate = () => {
        if (!titleField.current.value) {
            toast.error("Judul wajib diisi");
            titleField.current.focus();
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        dispatch(startProccess());
        toast
            .promise(createData(buildFormData()), {
                loading: "Loading...",
                success: "Konten berhasil ditambahkan",
                error: "Gagal menyimpan konten",
            })
            .then(() => {
                loadData();
                setOnProccess(false);
                dispatch(setModal({ isOpen: false }));
                dispatch(endProccess());
                clearFields();
            })
            .catch((err) => {
                toast.error(err.message);
                setOnProccess(false);
                dispatch(endProccess());
            });
    };

    const handleEdit: (id: number) => Promise<void> = async (id) => {
        await dispatch(setModal({ isOpen: true, isUpdate: true, keyId: id }));
        dispatch(startProccess());
        getDataById(id)
            .then((res) => {
                titleField.current.value = res.data.title ?? "";
                titleEnField.current.value = res.data.title_en ?? "";
                subtitleField.current.value = res.data.subtitle ?? "";
                descriptionField.current.value = res.data.description ?? "";
                descriptionEnField.current.value =
                    res.data.description_en ?? "";
                startDateField.current.value = res.data.start_date ?? "";
                endDateField.current.value = res.data.end_date ?? "";
                if (res.data.image_url) {
                    preview.current!.src = res.data.image_url;
                    preview.current!.hidden = false;
                } else {
                    preview.current!.hidden = true;
                }
                dispatch(endProccess());
            })
            .catch((err) => {
                toast.error(err.message);
                dispatch(endProccess());
            });
    };

    const handleUpdate = async (id: number) => {
        if (!validate()) return;
        dispatch(startProccess());
        toast
            .promise(updateData(buildFormData(), id), {
                loading: "Loading...",
                success: "Konten berhasil diperbarui",
                error: "Gagal memperbarui konten",
            })
            .then(() => {
                loadData();
                setOnProccess(false);
                dispatch(setModal({ isOpen: false, isUpdate: false, keyId: 0 }));
                dispatch(endProccess());
                clearFields();
            })
            .catch((err) => {
                toast.error(err.message);
                setOnProccess(false);
                dispatch(endProccess());
            });
    };

    const handleDelete = (id: number) => {
        setOnProccess(true);
        toast
            .promise(deleteDataById(id), {
                loading: "Loading...",
                success: "Konten berhasil dihapus",
                error: "Gagal menghapus konten",
            })
            .then(() => loadData())
            .catch((err) => {
                toast.error(err.message);
                setOnProccess(false);
            });
    };

    const handleCloseModal = () => {
        clearFields();
        dispatch(setModal({ isOpen: false, isUpdate: false, keyId: 0 }));
    };

    const handleFieldImageChange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageData(file);
        preview.current!.src = URL.createObjectURL(file);
        preview.current!.hidden = false;
    };

    const fieldTable: any = [
        { field: "title", name: "Judul" },
        { field: "title_en", name: "Judul (EN)" },
        { field: "subtitle", name: "Subjudul" },
        { field: "description", name: "Deskripsi" },
        { field: "image_url", name: "Gambar", type: "image" },
    ];

    return (
        <>
            <div className="grid grid-cols-1 gap-6">
                <DynamicModal
                    onSubmit={handleSubmit}
                    onUpdate={handleUpdate}
                    onClose={handleCloseModal}
                >
                    <div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                        >
                            <div className="mb-4">
                                <label className="admin-label">Judul</label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    id="title"
                                    placeholder="cth. Perjalanan Saya"
                                    required
                                    ref={titleField}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="admin-label">
                                    Judul (English)
                                    <span className="ml-1 text-xs text-gray-400 font-normal">
                                        (opsional — kosongkan untuk pakai judul
                                        Indonesia di /en)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    id="title_en"
                                    placeholder="e.g. My Journey"
                                    ref={titleEnField}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="admin-label">
                                    Subjudul
                                    <span className="ml-1 text-xs text-gray-400 font-normal">
                                        (opsional)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    id="subtitle"
                                    placeholder="cth. Backend Engineer"
                                    ref={subtitleField}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="admin-label">
                                        Tanggal Mulai
                                        <span className="ml-1 text-xs text-gray-400 font-normal">
                                            (opsional)
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        className="admin-input"
                                        id="start_date"
                                        ref={startDateField}
                                    />
                                </div>
                                <div>
                                    <label className="admin-label">
                                        Tanggal Selesai
                                        <span className="ml-1 text-xs text-gray-400 font-normal">
                                            (kosongkan jika masih berjalan)
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        className="admin-input"
                                        id="end_date"
                                        ref={endDateField}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="admin-label">
                                    Gambar
                                    <span className="ml-1 text-xs text-gray-400 font-normal">
                                        (opsional)
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFieldImageChange}
                                    ref={imageField}
                                    className="admin-file-input"
                                />
                                <div id="preview" className="mt-2">
                                    <div className="grid place-content-center mb-4">
                                        <img
                                            alt="preview"
                                            className="admin-preview-image"
                                            hidden
                                            onClick={() =>
                                                dispatch(
                                                    openModalImage({
                                                        imageUrl:
                                                            preview.current.src,
                                                    })
                                                )
                                            }
                                            ref={preview}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="admin-label">Deskripsi</label>
                                <textarea
                                    className="admin-input min-h-28"
                                    id="description"
                                    placeholder="Cerita tentang diri Anda. HTML sederhana didukung."
                                    ref={descriptionField}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="admin-label">
                                    Deskripsi (English)
                                    <span className="ml-1 text-xs text-gray-400 font-normal">
                                        (opsional — kosongkan untuk pakai
                                        deskripsi Indonesia di /en)
                                    </span>
                                </label>
                                <textarea
                                    className="admin-input min-h-28"
                                    id="description_en"
                                    placeholder="English version of the text above."
                                    ref={descriptionEnField}
                                />
                            </div>
                        </form>
                    </div>
                </DynamicModal>

                <div className="admin-panel overflow-hidden">
                    <div className="admin-panel-header">
                        <h3 className="admin-panel-title">
                            Konten Tentang Saya
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Ditampilkan di /about (ID) dan /en/about (EN),
                            diurutkan berdasarkan tanggal mulai.
                        </p>
                    </div>
                    <CustomTable
                        fieldTable={fieldTable}
                        data={data}
                        onProccess={onProccess}
                        setQuery={setQuery}
                        query={query}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    >
                        <Button type="button" onClick={handleCreate}>
                            <IconPlus className="h-4 w-4" />
                            Tambah Konten
                        </Button>
                    </CustomTable>
                </div>
            </div>
        </>
    );
};

export default AdminAbout;
