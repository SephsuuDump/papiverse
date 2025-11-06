
import { MESSAGING_URL } from "@/lib/urls";
import { requestData } from "./_config";

const url = `${MESSAGING_URL}/messaging`;

export class MessagingService {
    static async getConversations(id: number) {
        return await requestData(
        `${url}/conversations/${id}?page=1&limit=20`,
        "GET"
        );
    }

    static async getMessages(conversationId: number, userId: number) {
        return await requestData(
        `${url}/conversations/${conversationId}/messages?userId=${userId}&page=1&limit=20`,
        "GET"
        );
    }

    static async createDirectConversation(conversation: {
        name: string;
        type: string;
        participantIds: number[];
    }) {
        const payload = {
        name: conversation.name,
        type: conversation.type,
        participantIds: conversation.participantIds,
        };

        return await requestData(
        `${url}/conversations`,
        "POST",
        undefined,
        payload
        );
    }
}
