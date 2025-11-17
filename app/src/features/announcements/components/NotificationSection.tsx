"use client";

import { NotificationResponse } from "@/types/notification";
import Link from "next/link";
import { format } from "date-fns";
import { Bell, CheckCircle, Circle, Megaphone } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationSection({
    notifications,
    unreadCount
}: {
    notifications: NotificationResponse[];
    unreadCount?: number;
}) {

    if (!notifications || notifications.length === 0) {
        return (
            <div className="p-6 text-center text-sm text-muted-foreground">
                No notifications yet.
            </div>
        );
    }

    return (
        <ScrollArea className="h-screen">
            {notifications.map((notif) => (
                <Link 
                    key={notif.notificationId}
                    href={notif.link}
                    className="flex items-start gap-3 p-4 hover:bg-slate-50 transition rounded-md bg-light shadow-sm my-2"
                >
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900 flex-center-y gap-1">
                            {notif.type === "ANNOUNCEMENT" && <Megaphone className="w-4 h-4" />}
                            {notif.title}
                        </div>

                        <div className="text-xs text-gray-600 line-clamp-2">
                            {notif.message}
                        </div>

                        <div className="text-xs text-gray-400 mt-1">
                            {format(new Date(notif.createdAt), "MMM dd, yyyy • hh:mm a")}
                        </div>
                    </div>
                </Link>
            ))}
        </ScrollArea>
    );
}
