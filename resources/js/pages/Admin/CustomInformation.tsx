import SearchableSelect from "@/components/Forms/SearchAbleSelect";
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

import { fetchData as getDataType } from "@/services/customInformationTypes";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Button } from "@/components/UI/button";
import { IconPlus } from "@tabler/icons-react";

const CustomInformation = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMenu("Custom Information"));
    });

    const [onProccess, setOnProccess] = useState(false);
    const [data, setData] = useState<ICustomInformationTable>();
    const [query, setQuery] = useState({
        page: 1,
        per_page: 10,
        sort: "asc",
        search: "",
    });

    const [imageFile, setImageData] = useState<File>();
    const preview = useRef<any>();

    const titleField = useRef<any>("");
    const subtitleField = useRef<any>("");
    const descriptionField = useRef<any>("");
    const iconField = useRef<any>("");
    const linkField = useRef<any>("");
    const imageField = useRef<any>("");
    const typeField = useRef<any>("");

    const loadData = () => {
        toast
            .promise(fetchData(query), {
                loading: "Loading...",
                success: "Data has been loaded",
                error: "Error when loading data",
            })
            .then((res) => {
                setData({
                    data: res.data,
                    ...res.meta,
                });
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

    const handleCreate = () => {
        titleField!.current.value = "";
        subtitleField!.current.value = "";
        descriptionField!.current.value = "";
        iconField!.current.value = "";
        linkField!.current.value = "";
        typeField!.current.value = "";
        typeField!.current.setAttribute("data-id", "0");
        preview.current!.hidden = true;
        imageField.current.value = "";
        setImageData(undefined);
        dispatch(
            setModal({
                isOpen: true,
                title: "Create New Item",
            })
        );
    };

    const resetFields = () => {
        titleField.current.value = "";
        subtitleField.current.value = "";
        descriptionField.current.value = "";
        iconField.current.value = "";
        linkField.current.value = "";
        imageField.current.value = "";
        typeField.current.value = "";
        setImageData(undefined);
        preview.current!.src = "";
        preview.current!.hidden = true;
    };

    const handleSubmit = () => {
        //validation
        if (!titleField.current.value) {
            toast.error("Title is required");
            titleField.current.focus();
            return;
        }

        if (!typeField.current.value) {
            toast.error("Type is required");
            typeField.current.focus();
            return;
        }

        const formData = new FormData();
        formData.append("title", titleField.current.value);
        formData.append("subtitle", subtitleField.current.value);
        formData.append("description", descriptionField.current.value);
        formData.append("icon", iconField.current.value);
        formData.append("link", linkField.current.value);
        formData.append(
            "information_type_id",
            typeField.current.getAttribute("data-id")
        );
        if (imageFile) {
            formData.append("image", imageFile);
        }
        dispatch(startProccess());
        toast
            .promise(createData(formData), {
                loading: "Loading...",
                success: "Data has been created",
                error: "Error when loading data",
            })
            .then((_) => {
                loadData();
                setOnProccess(false);
                dispatch(
                    setModal({
                        isOpen: false,
                    })
                );
                dispatch(endProccess());
                resetFields();
            })
            .catch((err) => {
                toast.error(err.message);
                setOnProccess(false);
                dispatch(endProccess());
            });
    };

    const handleCloseModal = () => {
        dispatch(
            setModal({
                isOpen: false,
            })
        );
    };

    const handleEdit: (id: number) => void = (id: number) => {
        dispatch(
            setModal({
                isOpen: true,
                title: "Edit Item",
                isUpdate: true,
                keyId: id,
            })
        );
        dispatch(startProccess());
        titleField.current.disabled = true;
        titleField.current.value = "Please wait...";
        subtitleField.current.disabled = true;
        subtitleField.current.value = "Please wait...";
        descriptionField.current.disabled = true;
        descriptionField.current.value = "Please wait...";
        iconField.current.disabled = true;
        iconField.current.value = "Please wait...";
        typeField.current.disabled = true;
        typeField.current.value = "Please wait...";
        linkField.current.disabled = true;
        linkField.current.value = "Please wait...";
        imageField.current.disabled = true;
        preview.current.hidden = true;

        getDataById(id).then((res) => {
            titleField.current.disabled = false;
            titleField.current.value = res.data.title;
            subtitleField.current.disabled = false;
            subtitleField.current.value = res.data.subtitle;
            descriptionField.current.disabled = false;
            descriptionField.current.value = res.data.description;
            iconField.current.disabled = false;
            iconField.current.value = res.data.icon;
            linkField.current.disabled = false;
            typeField.current.setAttribute("data-id", res.data.type_id);
            typeField.current.value = res.data.type;
            typeField.current.disabled = false;
            linkField.current.value = res.data.link;
            imageField.current.disabled = false;
            preview.current.src = res.data.image_url;
            preview.current.hidden = false;
            dispatch(endProccess());
        });
    };

    const handleUpdate = (id: number) => {
        if (!titleField.current.value) {
            toast.error("Title is required");
            titleField.current.focus();
            return;
        }

        if (!typeField.current.value) {
            toast.error("Type is required");
            typeField.current.focus();
            return;
        }

        const formData = new FormData();
        formData.append("title", titleField.current.value);
        formData.append("subtitle", subtitleField.current.value);
        formData.append("description", descriptionField.current.value);
        formData.append("icon", iconField.current.value);
        formData.append("link", linkField.current.value);
        formData.append(
            "information_type_id",
            typeField.current.getAttribute("data-id")
        );
        if (imageFile) {
            formData.append("image", imageFile);
        }

        dispatch(startProccess());
        toast
            .promise(updateData(formData, id), {
                loading: "Loading...",
                success: "Data has been updated",
                error: "Error when loading data",
            })
            .then((_) => {
                loadData();
                setOnProccess(false);
                dispatch(
                    setModal({
                        isOpen: false,
                        isUpdate: false,
                        keyId: 0,
                    })
                );
                dispatch(endProccess());
                resetFields();
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
                success: "Data has been deleted",
                error: "Error when loading data",
            })
            .then((_) => {
                loadData();
            })
            .catch((err) => {
                toast.error(err.message);
                setOnProccess(false);
            });
    };

    const fieldTable: any = [
        { field: "title", name: "Title" },
        { field: "subtitle", name: "Subtitle" },
        { field: "description", name: "Description" },
        { field: "image_url", name: "Image", type: "image" },
        { field: "link", name: "Link" },
        { field: "icon", name: "Icon" },
        { field: "type", name: "Type Information" },
    ];

    const handleFieldImageChange = (e: any) => {
        const file = e.target.files[0];
        setImageData(file);
        preview.current!.src = URL.createObjectURL(file);
        preview.current!.hidden = false;
    };

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
                                <label className="admin-label">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    id="title"
                                    placeholder="Title"
                                    required
                                    ref={titleField}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="admin-label">
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    id="subtitle"
                                    placeholder="Subtitle"
                                    required
                                    ref={subtitleField}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="admin-label">
                                    Information Type
                                </label>
                                <SearchableSelect
                                    field={typeField}
                                    getData={getDataType}
                                    placeholder="Select Information Type"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="admin-label">
                                    Link
                                </label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    id="link"
                                    placeholder="Link"
                                    required
                                    ref={linkField}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="admin-label">
                                    Icon
                                </label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    id="icon"
                                    placeholder="Icon"
                                    required
                                    ref={iconField}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="admin-label">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFieldImageChange}
                                    ref={imageField}
                                    className="admin-file-input"
                                />
                                <div id="preview" className="mt-2">
                                    <div
                                        id="previewImage"
                                        className="grid place-content-center mb-4"
                                    >
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
                                <label className="admin-label">
                                    Description
                                </label>
                                <textarea
                                    className="admin-input min-h-28"
                                    id="description"
                                    placeholder="Description"
                                    required
                                    ref={descriptionField}
                                />
                            </div>
                        </form>
                    </div>
                </DynamicModal>
                <div className="admin-panel overflow-hidden">
                        <div className="admin-panel-header">
                            <h3 className="admin-panel-title">
                                List Data
                            </h3>
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
                            <Button
                                type="button"
                                onClick={handleCreate}
                                className="w-full sm:w-auto"
                            >
                                <IconPlus size={16} />
                                Create New Item
                            </Button>
                        </CustomTable>
                </div>
            </div>
        </>
    );
};

export default CustomInformation;
