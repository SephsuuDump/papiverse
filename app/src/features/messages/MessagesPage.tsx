"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth"
import { Conversation } from "@/types/messaging";
import { useEffect, useState } from "react";
import { MessagesSidebar } from "./components/MessagesSidebar";
import { getMessagesSocket } from "@/lib/socket";
import { MessagesCanvas } from "./components/MessagesCanvas";
import MessagesSuggestions from "./components/MessagesSuggestions";

export function MessagesPage() {
    const { claims, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Conversation>();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!claims.userId) return;

            try {
                const res = await fetch(
                    `http://localhost:8080/api/v1/messaging/conversations/${claims.userId}?page=1&limit=20`
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

    if (loading || authLoading || selected === undefined) return <PapiverseLoading />
    return (
        <section className="stack-md animate-fade-in-up">
            <div className="grid grid-cols-4 bg-light h-full rounded-md shadow-sm">
                <MessagesSidebar 
                    claims={ claims }
                    setReload={ setReload }
                    conversations={ conversations }
                    selected={ selected! }
                    setSelected={ setSelected }
                />
                <MessagesCanvas
                    claims={ claims }
                    selected={ selected! }
                />
                <MessagesSuggestions 
                    userId={ claims.userId }
                    conversations={ conversations }
                    setRealod={ setReload }
                />
            </div> 
        </section>
    )
}