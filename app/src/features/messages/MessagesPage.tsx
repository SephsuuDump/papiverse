"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth"
import { Conversation } from "@/types/messaging";
import { useEffect, useState } from "react";
import { MessagesSidebar } from "./components/MessagesSidebar";
import { getMessagesSocket } from "@/lib/socket";
import { MessagesCanvas } from "./components/MessagesCanvas";
import MessagesSuggestions from "./components/MessagesSuggestions";
import { CreateConversation } from "./components/CreateConversation";
import { useFetchData } from "@/hooks/use-fetch-data";
import { User } from "@/types/user";
import { UserService } from "@/services/user.service";
import { connectConversationUpdates } from "@/services/messaging.service";

export function MessagesPage() {
    const { claims, loading: authLoading } = useAuth();
    const { data: users, loading: usersLoading } = useFetchData<User>(UserService.getAllUsers);
    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Conversation>();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!claims.userId) return;

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/messaging/conversations/${claims.userId}?page=1&limit=20`
                );
                if (!res.ok) throw new Error("Failed to fetch conversations");

                const data = await res.json();
                setConversations(data);

                if (data.length > 0) setSelected(data[0]);
                else setSelected(undefined);

            } catch (err) {
                console.error("⚠️ Error loading conversations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [claims.userId, reload]);

    useEffect(() => {
        if (!claims?.userId) return;

        let client = connectConversationUpdates(
            claims.userId,
            (update) => {
                setConversations((prev) => {
                    const found = prev.find(c => c.id === update.conversationId);
                    if (!found) return prev;

                    const updated = {
                        ...found,
                        updatedAt: update.updatedAt,
                        updated_message: update.content,
                    };

                    return [
                        updated,
                        ...prev.filter(c => c.id !== update.conversationId)
                    ];
                });
            }
        );

        return () => {
            if (client) client.deactivate();
        };
    }, [claims?.userId]);


    if (loading || authLoading || usersLoading) return <PapiverseLoading />;

    return (
        <section className="stack-md animate-fade-in-up">
            <div className="grid grid-cols-4 bg-light h-full rounded-md shadow-sm">

                <MessagesSidebar 
                    claims={ claims }
                    setOpen={ setOpen }
                    setReload={ setReload }
                    conversations={ conversations }
                    selected={ selected }
                    setSelected={ setSelected }
                />

                {selected ? (
                    <MessagesCanvas
                        claims={ claims }
                        selected={ selected }
                    />
                ) : (
                    <div className="col-span-2 flex justify-center items-center text-gray-400">
                        Select or create a conversation.
                    </div>
                )}

            </div> 

            {open && (
                <CreateConversation
                    userData={ users }
                    claims={ claims }
                    setReload={ setReload }
                    setOpen={ setOpen } 
                />
            )}
        </section>
    );

}