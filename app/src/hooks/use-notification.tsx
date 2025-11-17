import { BASE_URL } from "@/lib/urls";
import { Claim } from "@/types/claims";
import { NotificationResponse } from "@/types/notification";
import { AnyARecord } from "dns";
import { useCallback, useEffect, useRef, useState } from "react"
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';


const useNotifications = ({ claims, onNewNotification }: {
    claims: Claim,
    onNewNotification: any
}) => {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const stompClientRef = useRef<Client | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/notifications/initial-feed/${claims.userId}/${claims.branch.branchId}`);
            const data = await res.json();
            
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data.notifications)
                    ? data.notifications
                    : Array.isArray(data.content)
                        ? data.content
                        : [];

            setNotifications(list);
            setUnreadCount(list.filter((n: NotificationResponse) => !n.read).length);
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to fetch notifications:', err);
        } finally {
        setLoading(false);
        }
    }, [claims.branch.branchId, claims.userId])

    const handleNewNotification = useCallback((notification: NotificationResponse) => {
        setNotifications(prev => [notification, ...prev]);
        if (!notification.read!) {
        setUnreadCount(prev => prev + 1);
        }
        
        // Call optional callback
        if (onNewNotification) {
        onNewNotification(notification);
        }
    }, [onNewNotification]);

    const markAsRead = useCallback(async (notificationId: number) => {
        try {
        const response = await fetch(`/api/notifications/${notificationId}/read`, {
            method: 'PUT'
        });
        
        if (!response.ok) throw new Error('Failed to mark as read');

        setNotifications(prev =>
            prev.map(n => n.notificationId === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
        console.error('Failed to mark as read:', err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        const unreadNotifications = notifications.filter(n => !n.read);
        
        try {
        await Promise.all(
            unreadNotifications.map(n => 
            fetch(`/api/notifications/${n.notificationId}/read`, { method: 'PUT' })
            )
        );
        
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        } catch (err) {
        console.error('Failed to mark all as read:', err);
        }
    }, [notifications]);

    const deleteNotification = useCallback(async (notificationId: number) => {
        try {
        const response = await fetch(`/api/notifications/${notificationId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete notification');

        setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
        
        const wasUnread = notifications.find(n => n.notificationId === notificationId)?.read === false;
        if (wasUnread) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        } catch (err) {
        console.error('Failed to delete notification:', err);
        }
    }, [notifications]);


    useEffect(() => {
        if (!claims.branch.branchId) return;

        fetchNotifications();

        // Connect to WebSocket
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_ASSETS}/ws`);
        const client = Stomp.over(socket);

        // Disable debug logging (optional)
        client.debug = () => {};

        client.connect(
        {},
        () => {
            console.log('WebSocket connected');

            // Subscribe to branch notifications
            client.subscribe(
            `/topic/notifications.branch.${claims.branch.branchId}`,
            (message) => {
                const notification = JSON.parse(message.body);
                handleNewNotification(notification);
            }
            );

            // Subscribe to user notifications if userId is provided
            if (claims.userId) {
            client.subscribe(
                `/topic/notifications.user.${claims.userId}`,
                (message) => {
                const notification = JSON.parse(message.body);
                handleNewNotification(notification);
                }
            );
            }

            stompClientRef.current = client;
        },
        (error: any) => {
            console.error('WebSocket connection error:', error);
            // setError('Failed to connect to notification service');
        }
        );

        // Cleanup on unmount
        return () => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
            console.log('WebSocket disconnected');
        }
        };
    }, [claims.branch.branchId, claims.userId]);

    return {
        notifications,
        loading,
        error,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refetch: fetchNotifications
    };
}

export default useNotifications;