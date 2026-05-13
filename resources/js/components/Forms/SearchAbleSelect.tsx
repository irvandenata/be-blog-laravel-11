import React, { useState, useEffect} from "react";

const SearchableSelect: React.FC<{
    getData: (params: any) => Promise<any>;
    placeholder: string;
    field: any;
}> = ({ getData, placeholder, field }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState<any>([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const optionList = React.createRef<HTMLDivElement>();
    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData({
                    all_data: 1,
                });
                if (field.current && field.current.getAttribute("data-id") != "0") {
                    field.previous = field.current;
                    const selected = response.data.find(
                        (option: any) => option.name === field.current.value
                    );
                    if (selected) setSelectedOption(selected.name);
                }
                setOptions(response.data); // Assuming the data is in the 'data' property of the response
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    },[]);

    // initial value

    // Filter options based on search term
    useEffect(() => {
        const filtered = options.filter((option: any) =>
            option.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [searchTerm, options]);

    return (
        <div className="relative w-full">
            <input
                type="text"
                className="admin-input"
                placeholder={placeholder}
                data-id={0}
                ref={field}
                onFocus={() => {
                    if (searchTerm) {
                        if (field.current.getAttribute("data-id") !== "0") {
                            setSearchTerm(field.current.value);
                        }
                    }
                    if (field.current.getAttribute("data-id") == "0") {
                        setSearchTerm("");
                        setSelectedOption(null);
                    }
                    optionList.current?.classList.remove("hidden");
                }}
                onBlur={() => {
                    setTimeout(() => {
                        if (field.current.getAttribute("data-id") === "0") {
                            field.current.value = "";
                            setSearchTerm("");
                        }
                        optionList.current?.classList.add("hidden");
                    }, 500);
                }}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedOption(null);
                    field.current.setAttribute("data-id", 0);
                }}
            />
            <div
                ref={optionList}
                className="absolute z-50 mt-2 hidden max-h-60 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg dark:border-slate-800 dark:bg-slate-950"
            >
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option: any) => (
                        <div
                            key={option.id}
                            className={`z-50 cursor-pointer px-3 py-2 text-slate-700 hover:bg-primary hover:text-white dark:text-slate-200 ${
                                selectedOption === option.id
                                    ? "bg-primary text-white"
                                    : ""
                            }`}
                            onClick={() => {
                                field.previous = field.current;
                                field!.current.setAttribute(
                                    "data-id",
                                    option.id
                                );
                                setSelectedOption(option.id);
                                setSearchTerm(option.name);
                                field.current.value = option.name;
                                optionList.current?.classList.add("hidden");
                            }}
                        >
                            {option.name}
                        </div>
                    ))
                ) : (
                    <div className="z-50 px-3 py-2 text-slate-500">
                        No options found
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchableSelect;
