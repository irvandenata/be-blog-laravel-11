import { ISetting } from "@/interfaces/setting";
import { setMenu } from "@/redux/slices/menuSlice";
import { useDispatch } from "react-redux";
import { fetchSettingData, updateSettingData } from "@/services/setting";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/UI/button";
import { IconDeviceFloppy, IconRefresh } from "@tabler/icons-react";

const SettingPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMenu("Settings"));
    });

    //get data from api
    const [data, setData] = useState<ISetting>();
    const [oldData, setOldData] = useState<ISetting>();
    const [imageData, setImageData] = useState<File>();
    const preview = useRef<HTMLImageElement | null>(null);
    const isLoading = useRef(false);
    const fieldImage = useRef<any>("");
    const fieldTitle = useRef<any>("");
    const fieldDescription = useRef<any>("");

    useEffect(() => {
        isLoading.current = true;
        toast
            .promise(fetchSettingData(), {
                loading: "Loading...",
                success: "Data has been loaded",
                error: "Error when loading data",
            })
            .then((res) => {
                setData({
                    header_title: res.data.header.title,
                    header_description: res.data.header.description,
                    header_image: res.data.header.image,
                });
                setOldData({
                    header_title: res.data.header.title,
                    header_description: res.data.header.description,
                    header_image: res.data.header.image,
                });
                isLoading.current = false;
                preview.current!.classList.remove("hidden");

                changeField();
            });
    }, []);

    const resetData = (e: any) => {
        e.preventDefault();
        setData(oldData);
        toast.success("Data has been reset");
    };

    const changeField = () => {
        if (!isLoading.current) {
            fieldImage.current.disabled = false;
            fieldTitle.current.disabled = false;
            fieldDescription.current.disabled = false;
        } else {
            fieldImage.current.disabled = true;
            fieldTitle.current.disabled = true;
            fieldDescription.current.disabled = true;
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (isLoading.current) {
            toast.loading("Wait...", {
                duration: 500,
            });
            return;
        }

        //disable button save

        // call api to update data
        isLoading.current = true;
        changeField();
        const formData = new FormData();
        formData.append("header_title", data!.header_title);
        formData.append("header_description", data!.header_description);
        if (imageData) {
            formData.append("header_image", imageData);
        }
        toast
            .promise(updateSettingData(formData), {
                loading: "Updating...",
                success: "Data has been updated",
                error: "Error when updating data",
            })
            .then((res) => {
                setOldData(res);
                isLoading.current = false;
                setImageData(undefined);
                changeField();
            });
    };

    const handleFieldImageChange = (e: any) => {
        const file = e.target.files[0];
        setImageData(file);
        preview.current!.src = URL.createObjectURL(file);
        preview.current!.classList.remove("hidden");
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-6">
                <div className="admin-panel overflow-hidden">
                        <div className="admin-panel-header">
                            <h3 className="admin-panel-title">
                                Landing Page Settings
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} method="post">
                            <div className="admin-form">
                                <div>
                                    <label className="admin-label">
                                        Header Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Header Title"
                                        value={data?.header_title || ""}
                                        onChange={(e) =>
                                            setData({
                                                ...data!,
                                                header_title: e.target.value,
                                            })
                                        }
                                        ref={fieldTitle}
                                        required
                                        disabled
                                        className="admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="admin-label">
                                        Header Description
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Header Description"
                                        value={data?.header_description || ""}
                                        onChange={(e) =>
                                            setData({
                                                ...data!,
                                                header_description:
                                                    e.target.value,
                                            })
                                        }
                                        ref={fieldDescription}
                                        disabled
                                        className="admin-input min-h-36"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="admin-label">
                                        Header Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFieldImageChange}
                                        disabled
                                        ref={fieldImage}
                                        className="admin-file-input"
                                    />
                                </div>

                                <div
                                    id="previewImage"
                                    className="grid place-content-center"
                                >
                                    <img
                                        src={data?.header_image || ""}
                                        alt="preview"
                                        className="admin-preview-image hidden"
                                        ref={preview}
                                    />
                                </div>
                            </div>
                            <div className="admin-actions">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                        onClick={(e) => resetData(e)}
                                    >
                                        <IconRefresh size={16} />
                                        Reset
                                    </Button>
                                    <Button
                                        className="w-full sm:w-auto"
                                        type="submit"
                                    >
                                        <IconDeviceFloppy size={16} />
                                        Save
                                    </Button>
                                </div>
                        </form>
                </div>
            </div>
        </>
    );
};

export default SettingPage;
