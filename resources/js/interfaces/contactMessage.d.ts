export interface IContactMessage {
    id: number;
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    read_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface IContactMessageTable {
    data: IContactMessage[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export interface IContactMessageNotification {
    unread_count: number;
    messages: IContactMessage[];
}
