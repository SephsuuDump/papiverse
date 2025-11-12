"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessagesSkeleton } from "@/components/ui/skeleton";
import { getMessagesSocket } from "@/lib/socket";
import { connectWebSocket, sendMessage, sendStopTyping, sendTyping } from "@/services/messaging.service";
import { Claim } from "@/types/claims";
import { Conversation, Message } from "@/types/messaging";
import { EllipsisIcon, Info, Link, Mic, Send, SmilePlus } from "lucide-react";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";

interface Props {
    claims: Claim;
    selected: Conversation;
}

export function MessagesCanvas({ claims, selected }: Props) {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [typingUsers, setTypingUsers] = useState<{ userId: number; name: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const readTimeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (!selected) return;
        setLoading(true);

        connectWebSocket(claims.userId, selected.id, (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });


        // Listen for messages via stompClient.subscribe in websocket.ts
        // You could also move subscriptions here if needed

        setTimeout(() => setLoading(false), 500); // Simulate small delay for smoother UX
    }, [selected]);

    // Scroll to bottom when messages or typing updates
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, typingUsers]);

    // Handle typing indicator (STOMP equivalent)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
        sendTyping({ conversationId: selected.id, userId: claims.userId });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            sendStopTyping({ conversationId: selected.id, userId: claims.userId });
        }, 2000);
    };

    // Send a message through STOMP
    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const msg: Message = {
            id: Date.now(),
            senderId: claims.userId,
            content: messageInput.trim(),
            messageType: "text",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            conversationId: selected.id,
        } as any;

        sendMessage(msg);
        setMessageInput("");
    };


    if (loading) return <MessagesSkeleton />
    return(
        <section className="relative flex flex-col col-span-2 border-1 h-[95vh]">
            {selected && (
                <>
                    {/* Header */}
                    <div className="flex px-4 py-2 gap-2 sticky top-0 shadow-sm bg-light">
                        <div className="flex font-semibold justify-center items-center bg-darkbrown text-light w-9 h-9 rounded-full">
                            {"KP"}
                        </div>
                        <div className="my-auto font-semibold text-sm truncate text-[16px]">
                            {selected.name === "none" ? (
                                selected.participants.length > 2 ? (
                                    selected.participants.slice(0, 3).map(p => p.lastName).join(', ')
                                ) : (
                                    selected.participants[0].id !== claims.userId
                                        ? `${selected.participants[0].firstName ?? ''} ${selected.participants[0].lastName ?? ''}`
                                        : `${selected.participants[1].firstName ?? ''} ${selected.participants[1].lastName ?? ''}`
                                )
                            ) : (
                                selected.name
                            )}
                        </div>
                        <div className="ms-auto flex gap-2">
                            <button>
                                <Info className="w-4 h-4" strokeWidth={2} />
                            </button>
                            <button>
                                <EllipsisIcon className="w-4 h-4" strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div 
                        ref={messagesContainerRef}
                        className="flex-col w-full flex-1 bg-white overflow-y-auto pb-8"
                        // onScroll={handleScroll}
                    >
                        {messages.map((message, index) => {
                            const isOwnMessage = message.senderId === claims.userId;
                            const prevMessage = index > 0 ? messages[index - 1] : null;

                            const showSenderName = !prevMessage || prevMessage.senderId !== message.senderId;
                            
                            return (
                                <Fragment key={message.id || index}>
                                    {showSenderName && (
                                        <div className={`text-gray text-[10px] -mb-1.5 ${isOwnMessage ? "text-end pr-2" : "pl-2 text-start"}`}>
                                            {selected.participants.find(i => i.id === message.senderId)?.firstName}
                                        </div>
                                    )}
                                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} my-2`}>
                                        <div 
                                            className={`
                                                w-fit max-w-[60%] text-xs p-2
                                                ${isOwnMessage 
                                                ? 'bg-darkorange text-light mr-2 rounded-t-lg rounded-bl-lg' 
                                                : 'bg-light ml-2 rounded-t-lg rounded-br-lg'
                                                }
                                            `}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                </Fragment>
                            );
                        })}
                        
                        {/* TYPING INDICATOR */}
                        {typingUsers?.length > 0 && (
                            <div className="w-fit max-w-6/10 text-xs bg-gray-200 p-2 my-2 ml-2 rounded-t-lg rounded-br-lg italic">
                                {typingUsers.map(u => u.name).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                            </div>
                        )} 
                        
                        <div ref={messagesEndRef} />
                    </div>

                    <form 
                        className="absolute w-full bottom-0 px-4 border-t-1" 
                        onSubmit={handleSendMessage}
                    >
                        <div className="flex items-center w-full bg-white">
                            <button className="mx-2">
                                <Link className="w-4 h-4" strokeWidth={2} />
                            </button>
                            <Input
                                value={messageInput}
                                onChange={ handleInputChange }
                                className="w-full border-0 focus:!outline-none focus:!ring-0"
                                placeholder="Enter your message here" 
                            />
                            <div className="flex gap-2">
                                <button>
                                    <SmilePlus className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <button>
                                    <Mic className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <Button
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    size="sm"
                                    className="bg-blue rounded-full text-xs h-fit py-1.5"
                                >
                                    <Send className="!w-3 !h-3"/>Send
                                </Button>
                            </div>
                        </div>
                    </form>
                </>
            )}
        </section>
    );
}