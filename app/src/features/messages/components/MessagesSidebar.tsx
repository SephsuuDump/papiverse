"use client";

import { Dispatch, SetStateAction } from "react";
import { Plus, Search, UserRoundPlus, UsersRound } from "lucide-react";

import { Input } from "@/components/ui/input";
import { AppAvatar } from "@/components/shared/AppAvatar";

import { Claim } from "@/types/claims";
import { Conversation } from "@/types/messaging";
import { fromatMessageDateTime } from "@/lib/formatter";
import { useSearchFilter } from "@/hooks/use-search-filter";

interface Props {
    claims: Claim;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setDirect: Dispatch<SetStateAction<boolean>>;
    conversations: Conversation[];
    selected?: Conversation;
    setSelected: (conversation: Conversation) => void;
}

export function MessagesSidebar({
    claims,
    setOpen,
    setDirect,
    conversations,
    selected,
    setSelected,
}: Props) {
    const { setSearch, filteredItems } = useSearchFilter(conversations, ["name"]);

    const renderConversationName = (conversation: Conversation) => {
        if (conversation.name !== "none") return conversation.name;

        // Direct / group name fallback
        if (conversation.participants.length > 2) {
            return conversation.participants
                .slice(0, 3)
                .map((p) => p.lastName)
                .join(", ");
        }

        const [first, second] = conversation.participants;
        const other =
            first.id !== claims.userId
                ? first
                : second;

        return `${other?.firstName ?? ""} ${other?.lastName ?? ""}`.trim();
    };

    return (
        <section className="flex flex-col border-1 py-2.5 h-[95vh]">
            {/* Header + Search */}
            <div className="flex flex-col gap-2 px-4">
                <div className="flex-center-y justify-between items-center">
                    <div className="text-lg font-semibold">Chats</div>
                    <div className="flex gap-2">
                        <UserRoundPlus 
                            onClick={() => setDirect(true)}
                            className="w-5 h-5 cursor-pointer hover:text-gray"
                        />
                        <UsersRound
                            onClick={() => setOpen(true)}
                            className="w-5 h-5 cursor-pointer hover:text-gray"
                        />
                    </div>
                </div>

                <div className="flex items-center rounded-md bg-white">
                    <div className="flex w-10">
                        <Search className="w-4 h-4 mx-auto" strokeWidth={2} />
                    </div>
                    <Input
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                        className="!h-fit border-0 pl-0 focus:!outline-none focus:!ring-0"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="mt-2 px-4 pb-4 overflow-y-auto flex-1">
                {filteredItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => setSelected(item)}
                        className={`relative w-full flex p-2 shadow-sm bg-white rounded-md truncate my-1.5 transition-colors ${
                            selected?.id === item.id && "!bg-orange-200"
                        }`}
                    >
                        <AppAvatar fallback="KP" />
                        <div className="w-full pl-1">
                            <div className="text-start font-semibold text-sm">
                                {renderConversationName(item)}
                            </div>
                            <div className="w-6/10 text-start text-xs text-gray truncate">
                                {item.updated_message || "No existing message"}
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 text-[10px]">
                            {fromatMessageDateTime(item.updatedAt)}
                        </div>
                    </button>
                ))}

                {filteredItems.length === 0 && (
                    <div className="text-xs text-gray-400 text-center mt-4">
                        No conversations found.
                    </div>
                )}
            </div>
        </section>
    );
}
