"use client"

import { Input } from "@/components/ui/input";
import { Claim } from "@/types/claims";
import { Conversation } from "@/types/messaging";
import { Plus, Search } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fromatMessageDateTime } from "@/lib/formatter";
import { CreateConversation } from "./CreateConversation";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { AppAvatar } from "@/components/shared/AppAvatar";

interface Props {
    claims: Claim;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setReload: Dispatch<SetStateAction<boolean>>;
    conversations: Conversation[];
    selected: Conversation | undefined;
    setSelected: (i: Conversation) => void;
}

export function MessagesSidebar({ claims, setReload, setOpen, conversations, selected, setSelected }: Props) {
    const { setSearch, filteredItems } = useSearchFilter(conversations, ['name']);

    return(
        <>
            <section className="flex flex-col border-1 py-2.5 h-[95vh]">
                <div className="flex flex-col gap-2 px-4">
                    <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">Chats</div>
                        <button 
                            onClick={ () => setOpen(true) }
                            className="w-6 h-6 flex justify-center items-center bg-darkorange rounded-full"
                        >
                            <Plus className="w-3 h-3 text-light" />
                        </button>
                    </div>
                    <div className="flex items-center rounded-md bg-white">
                        <div className="flex w-10">
                            <Search className="w-4 h-4 mx-auto" strokeWidth={2} />
                        </div>
                        <Input
                            placeholder="Search"
                            onChange={ e => setSearch(e.target.value) }
                            className="!h-fit border-0 pl-0 focus:!outline-none focus:!ring-0"
                        />  
                    </div>
                </div>
                <div className="mt-2 px-4 pb-4 overflow-y-auto flex-1">
                    {conversations.map((item, index) => (
                        <button 
                            onClick={() => setSelected(item)}
                            key={index}
                            className={`relative w-full flex p-2 shadow-sm bg-white rounded-md truncate my-1.5 ${selected?.id === item.id && "!bg-orange-200"}`}
                        >
                            <AppAvatar fallback="KP" />
                            <div className="w-full pl-1">
                                <div className="text-start font-semibold text-sm">
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
            </section>
        </>
    );
}

