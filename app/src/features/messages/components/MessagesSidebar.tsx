"use client"

import { Input } from "@/components/ui/input";
import { Claim } from "@/types/claims";
import { Conversation } from "@/types/messaging";
import { Plus, Search } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fromatMessageDateTime } from "@/lib/formatter";
import { getMessagesSocket } from "@/lib/socket";
import { CreateConversation } from "./CreateConversation";
import { MESSAGING_URL } from "@/lib/urls";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const tabs = ['DIRECT', 'GROUPS', 'PUBLIC'];

interface Props {
    claims: Claim;
    setReload: Dispatch<SetStateAction<boolean>>;
    conversations: Conversation[];
    selected: Conversation;
    setSelected: (i: Conversation) => void;
}

export function MessagesSidebar({ claims, setReload, conversations, selected, setSelected }: Props) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('DIRECT');
    const [selectedConversations, setSelectedConversations] = useState<Conversation[]>(conversations);

    useEffect(() => {
        if (activeTab === 'DIRECT') {
            setSelectedConversations(conversations.filter(i => i.type === 'direct'));
        } else if (activeTab === 'GROUPS') {
            setSelectedConversations(conversations.filter(i => i.type === 'group'));
        } else setSelectedConversations(conversations);
    }, [activeTab]);

    useEffect(() => {
        // 🔌 Initialize SockJS + STOMP
        const socket = new SockJS(MESSAGING_URL ?? "http://localhost:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("✅ Connected to Spring Boot WS");

                // 📨 Subscribe to conversations for this user
                stompClient.subscribe(`/topic/user.${claims.userId}.conversations`, (msg: any) => {
                    const updated = JSON.parse(msg.body);
                    setSelectedConversations(updated);
                });
            },
            onDisconnect: () => {
                console.log("❌ Disconnected from WebSocket");
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [claims.userId]);

    return(
        <section className="flex flex-col border-1 py-2.5 h-[95vh]">
            <div className="flex flex-col gap-2 px-4">
                <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">Chats</div>
                    <button 
                        onClick={ () => setOpen(!open) }
                        className="w-6 h-6 flex justify-center items-center bg-darkorange rounded-full"
                    >
                        <Plus className="w-3 h-3 text-light" />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    {tabs.map((item, index) => (
                        <button
                            onClick={() => setActiveTab(item)}
                            key={index}
                            className={`text-[10px] flex gap-[2px] ${activeTab === item && "font-semibold"}`}
                        >
                            {item} <div className="w-1 h-1 bg-darkred rounded-full mt-[2px]"></div>
                        </button>
                    ))}
                </div>
                <div className="flex items-center rounded-md bg-white">
                    <div className="flex w-10">
                        <Search className="w-4 h-4 mx-auto" strokeWidth={2} />
                    </div>
                    <Input
                        placeholder="Search"
                        className="!h-fit border-0 pl-0 focus:!outline-none focus:!ring-0"
                    />  
                </div>
            </div>
            <div className="mt-2 pl-4 pr-0.5 pb-4 overflow-y-auto flex-1">
                {selectedConversations.map((item, index) => (
                    <button 
                        onClick={() => setSelected(item)}
                        key={index}
                        className={`relative w-full flex p-2 shadow-sm bg-white rounded-md my-1.5 ${selected?.id === item.id && "!bg-orange-200"}`}
                    >
                        <div className="flex col-span-2">
                            <div className="mx-auto flex font-semibold justify-center items-center bg-darkbrown text-light w-9 h-9 rounded-full">
                                {"KP"}
                            </div>
                        </div>
                        <div className="w-full pl-1">
                            <div className="text-start font-semibold text-sm truncate">
                                {item.name === "none" ? (
                                    item.participants.length > 2 ? (
                                        item.participants.slice(0, 3).map(p => p.lastName).join(', ')
                                    ) : (
                                        item.participants[0].id !== claims.userId
                                            ? `${item.participants[0].firstName ?? ''} ${item.participants[0].lastName ?? ''}`
                                            : `${item.participants[1].firstName ?? ''} ${item.participants[1].lastName ?? ''}`
                                    )
                                ) : (
                                    item.name
                                )}
                            </div>
                            <div className="w-6/10 text-start text-xs text-gray truncate">{ item.updated_message || "No existing message" }</div>
                        </div>
                        <div className="absolute bottom-2 right-2 text-[10px]">{ fromatMessageDateTime(item.updatedAt) }</div>
                    </button>
                ))}
            </div>

            {open && (
                <CreateConversation 
                    claims={ claims }
                    setReload={ setReload }
                    setOpen={ setOpen } 
                />
            )}
        </section>
    );
}

