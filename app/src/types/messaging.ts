export interface Conversation {
    id: number;
    type: string;
    name: string;
    updated_at: string,
    updated_message: string,
    participants: {
        id: number;
        firstName: string;
        lastName: string;
    }[];
}

export interface Message {
    id?: number | string;
    tempId?: string;
    senderId: number;
    content: string;
    messageType: string;
    createdAt: string;
    updatedAt: string;
    parentMessage?: number | null;
    conversationId?: number;
    isOptimistic?: boolean
}