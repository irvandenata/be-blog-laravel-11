import DynamicModal from "@/components/Modals/DynamicModal";
import CustomTable from "@/components/Tables/CustomTable";
import { IArticleTagTable } from "@/interfaces/article";
import { setMenu } from "@/redux/slices/menuSlice";
import {
    endProccess,
    setModal,
    startProccess,
} from "@/redux/slices/modalSlice";
import {
    createData,
    deleteDataById,
    fetchData,
    getDataById,
    updateData,
} from "@/services/articleTag";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Button } from "@/components/UI/button";
import { IconPlus } from "@tabler/icons-react";

const ArticleTag = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setMenu("Article Tag"));
    });
    const [onProccess, setOnProccess] = useState(false);
    const [data, setData] = useState<IArticleTagTable>();
    const [query, setQuery] = useState({
        page: 1,
        per_page: 10,
        sort: "asc",
        search: "",
    });
    const nameField = useRef<any>("");

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
        nameField.current.value = "";
        dispatch(
            setModal({
                isOpen: true,
                title: "Create New Item",
            })
        );
    };

    const handleSubmit = () => {
        //validation
        if (!nameField.current.value) {
            toast.error("Name is required");
            nameField.current.focus();
            return;
        }
        dispatch(startProccess());

        const formData = new FormData();
        formData.append("name", nameField.current.value);
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
                nameField.current.value = "";
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
        nameField.current.disabled = true;
        nameField.current.value = "Please wait...";

        getDataById(id).then((res) => {
            nameField.current.disabled = false;
            nameField.current.value = res.data.name;
            dispatch(endProccess());
        });
    };

    const handleUpdate = (id: number) => {
        //validation
        if (!nameField.current.value) {
            toast.error("Name is required");
            nameField.current.focus();
            return;
        }
        dispatch(startProccess());
        const formData = new FormData();
        formData.append("name", nameField.current.value);
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
                nameField.current.value = "";
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
        { field: "name", name: "Name" },
        { field: "slug", name: "Slug" },
    ];

    return (
        <>
            <DynamicModal
                onSubmit={handleSubmit}
                onUpdate={handleUpdate}
                onClose={handleCloseModal}
            >
                <div>
                    <form onSubmit={(e) => 
                    {
                        e.preventDefault();
                        handleSubmit();
                     }
                    
                    } >
                        <div className="mb-4">
                            <label className="admin-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="admin-input"
                                id="name"
                                placeholder="Name"
                                required
                                ref={nameField}
                            />
                        </div>
                    </form>
                </div>
            </DynamicModal>

            <div className="grid grid-cols-1 gap-6">
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

export default ArticleTag;
