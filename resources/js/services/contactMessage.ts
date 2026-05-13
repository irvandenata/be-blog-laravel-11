import { API_ENDPOINT } from "@/constants/api";
import { IContactMessageNotification } from "@/interfaces/contactMessage";
import callAPI from "@/utils/callApi";

export async function fetchData(query?: Record<string, string | number>): Promise<any> {
    const queryParam = new URLSearchParams(
        Object.entries(query ?? {}).map(([key, value]) => [key, String(value)])
    ).toString();
    const url = `${API_ENDPOINT}/contact-messages?${queryParam}`;

    return callAPI({
        url,
        method: "GET",
        token: true,
    });
}

export async function getDataById(id: number): Promise<any> {
    const url = `${API_ENDPOINT}/contact-messages/${id}`;

    return callAPI({
        url,
        method: "GET",
        token: true,
    });
}

export async function markAsRead(id: number): Promise<any> {
    const url = `${API_ENDPOINT}/contact-messages/${id}/read`;

    return callAPI({
        url,
        method: "PATCH",
        token: true,
    });
}

export async function deleteDataById(id: number): Promise<any> {
    const url = `${API_ENDPOINT}/contact-messages/${id}`;

    return callAPI({
        url,
        method: "DELETE",
        token: true,
    });
}

export async function fetchNotifications(): Promise<{
    data: IContactMessageNotification;
}> {
    const url = `${API_ENDPOINT}/contact-messages/notifications`;

    return callAPI({
        url,
        method: "GET",
        token: true,
    });
}
