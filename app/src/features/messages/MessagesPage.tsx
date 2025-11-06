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
        if (!claims.userId) return;
        const socket = getMessagesSocket(claims.userId);
        socket.emit("joinUser", { userId: claims.userId });
        socket.on("conversations", (data: Conversation[]) => {
            setConversations(data);
            if (data.length > 0) {
                setSelected(data[0]);   
            } else {
                setSelected(undefined); 
            }
            setLoading(false);
        });
        return () => {
            socket.disconnect();
        };
    }, [claims.userId]);

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