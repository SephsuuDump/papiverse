
import { BASE_URL, MESSAGING_URL } from "@/lib/urls";
import { requestData } from "./_config";

const url = `${BASE_URL}/messaging`;

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

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_WEBSOCKET;

let stompClient: Client;

export const connectConversationUpdates = (
    userId: number,
    onConversationUpdate: (update: any) => void
) => {
    const client = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL!),
        reconnectDelay: 5000,
        onConnect: () => {
            client.subscribe(`/topic/user.${userId}.conversations`, (msg) => {
                const update = JSON.parse(msg.body);
                onConversationUpdate(update);
            });
        }
    });

    client.activate();
    return client;
};

export const connectWebSocket = (
  userId: number,
  conversationId: number,
  onMessageReceived?: (message: any) => void,
  onTyping?: (dto: any) => void,
  onStopTyping?: (dto: any) => void
) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL!),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ Connected to WebSocket");

      // ✅ Subscribe to conversation messages
      stompClient.subscribe(`/topic/conversation.${conversationId}`, (msg) => {
        const body = JSON.parse(msg.body);
        console.log("💬 New message:", body);
        onMessageReceived?.(body);
      });

      // ✅ Typing indicators (use dots, not slashes)
      stompClient.subscribe(`/topic/conversation.${conversationId}.typing`, (msg) => {
        const body = JSON.parse(msg.body);
        console.log("✍️ Typing:", body);
        onTyping?.(body);
      });

      stompClient.subscribe(`/topic/conversation.${conversationId}.stopTyping`, (msg) => {
        const body = JSON.parse(msg.body);
        console.log("🛑 Stopped typing:", body);
        onStopTyping?.(body);
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"], frame.body);
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
  }
};

export const sendMessage = (message: any) => {
  if (stompClient?.connected) {
    stompClient.publish({
      destination: "/app/sendMessage",
      body: JSON.stringify(message),
    });
  }
};

export const sendTyping = (dto: any) => {
  if (stompClient?.connected) {
    stompClient.publish({
      destination: "/app/typing",
      body: JSON.stringify(dto),
    });
  }
};

export const sendStopTyping = (dto: any) => {
  if (stompClient?.connected) {
    stompClient.publish({
      destination: "/app/stopTyping",
      body: JSON.stringify(dto),
    });
  }
};
