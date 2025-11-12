
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


import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SOCKET_URL = "http://localhost:8080/ws"; // same as your Spring Boot endpoint

let stompClient: Client;

export const connectWebSocket = (
  userId: number,
  conversationId: number,
  onMessageReceived?: (message: any) => void
) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ Connected to WebSocket");

      // Subscribe to conversation messages
      stompClient.subscribe(`/topic/conversation/${conversationId}`, (msg) => {
        const body = JSON.parse(msg.body);
        console.log("💬 New message:", body);
        if (onMessageReceived) onMessageReceived(body);
      });

      // Typing indicators
      stompClient.subscribe(`/topic/conversation/${conversationId}/typing`, (msg) => {
        console.log("✍️ Typing:", JSON.parse(msg.body));
      });

      stompClient.subscribe(`/topic/conversation/${conversationId}/stopTyping`, (msg) => {
        console.log("🛑 Stopped typing:", JSON.parse(msg.body));
      });
    },
  });

  stompClient.activate();
};


export const sendMessage = (message: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({ destination: "/app/sendMessage", body: JSON.stringify(message) });
  }
};

export const sendTyping = (dto: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({ destination: "/app/typing", body: JSON.stringify(dto) });
  }
};

export const sendStopTyping = (dto: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({ destination: "/app/stopTyping", body: JSON.stringify(dto) });
  }
};
