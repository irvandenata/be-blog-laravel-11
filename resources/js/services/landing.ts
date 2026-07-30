import callAPI from "../utils/callApi";
import { API_VERSION, ROOT_API } from "@/constants/api";

export async function fetchDataSetting(): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/settings`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}

export async function fetchDataTechStack(locale: string = "id"): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/custom-informations?per_page=1000&search_subtitles[]=others&search_subtitles[]=frontend&search_subtitles[]=backend&locale=${locale}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}


export async function fetchDataSocialMedia(): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/custom-informations?per_page=1000&search_type_id=1`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}

export async function fetchDataWorkExperience(locale: string = "id"): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/custom-informations?per_page=1000&search_type_id=3&order_desc_by=start_date&locale=${locale}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}


/**
 * About-page entries. type_id 4 is the "about" information type added by
 * migration; ordered by start_date so the author controls sequence from the
 * admin without a dedicated sort column.
 */
export async function fetchDataAbout(locale: string): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/custom-informations?per_page=1000&search_type_id=4&order_asc_by=start_date&locale=${locale}`;
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}


export async function fetchDataProjects(locale: string = "id"): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/articles?per_page=3&search_latest=true&search_category_id=1&locale=${locale}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}


export async function sendMessage(formData: {
    name: string;
    email: string;
    subject?: string;
    message: string;
}): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/send-message`;
    // handling when error
    const response = await callAPI({
        url,
        method: "POST",
        data: formData
    });

    return response;
}
