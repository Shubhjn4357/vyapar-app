import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';

interface NotificationData {
    id: string;
    title: string;
    message: string;
    type: 'bill_reminder' | 'payment_received' | 'subscription_expiry' | 'system_update' | 'promotional';
    data?: any;
    isRead: boolean;
    createdAt: Date;
}

interface NotificationContextType {
    notifications: NotificationData[];
    unreadCount: number;
    isLoading: boolean;
    requestPermissions: () => Promise<boolean>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (notificationId: string) => Promise<void>;
    refreshNotifications: () => Promise<void>;
    sendLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, company } = useAuth();
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (token) {
            refreshNotifications();
            setupNotificationListeners();
        }
    }, [token, company]);

    const requestPermissions = useCallback(async (): Promise<boolean> => {
        try {
            if (Platform.OS === 'web') {
                // For web, use the Notification API
                if ('Notification' in window) {
                    const permission = await Notification.requestPermission();
                    return permission === 'granted';
                }
                return false;
            } else {
                // For mobile, use Expo notifications
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus === 'granted') {
                    // Get push token for the device
                    const token = await Notifications.getExpoPushTokenAsync();
                    console.log('Push token:', token.data);
                    // TODO: Send this token to your server
                }

                return finalStatus === 'granted';
            }
        } catch (error) {
            console.error('Failed to request notification permissions:', error);
            return false;
        }
    }, []);

    const setupNotificationListeners = useCallback(() => {
        if (Platform.OS !== 'web') {
            // Listen for notifications received while app is foregrounded
            const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
                console.log('Notification received in foreground:', notification);
                refreshNotifications();
            });

            // Listen for user interactions with notifications
            const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
                console.log('Notification response:', response);
                const notificationData = response.notification.request.content.data;
                // Handle notification tap - navigate to relevant screen
                handleNotificationTap(notificationData);
            });

            return () => {
                foregroundSubscription.remove();
                responseSubscription.remove();
            };
        }
    }, []);

    const handleNotificationTap = (data: any) => {
        // TODO: Implement navigation based on notification data
        console.log('Handle notification tap:', data);
    };

    const refreshNotifications = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const notificationData = data.data.map((notif: any) => ({
                    id: notif.id,
                    title: notif.title,
                    message: notif.message,
                    type: notif.type,
                    data: notif.data,
                    isRead: notif.isRead,
                    createdAt: new Date(notif.createdAt),
                }));

                setNotifications(notificationData);
                setUnreadCount(notificationData.filter((n: NotificationData) => !n.isRead).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const markAsRead = useCallback(async (notificationId: string) => {
        if (!token) return;

        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/notifications/${notificationId}/read`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === notificationId ? { ...notif, isRead: true } : notif
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, [token]);

    const markAllAsRead = useCallback(async () => {
        if (!token) return;

        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/notifications/mark-all-read`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ companyId: company?.id }),
                }
            );

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(notif => ({ ...notif, isRead: true }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    }, [token, company]);

    const deleteNotification = useCallback(async (notificationId: string) => {
        if (!token) return;

        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/notifications/${notificationId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const deletedNotification = notifications.find(n => n.id === notificationId);
                setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
                
                if (deletedNotification && !deletedNotification.isRead) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    }, [token, notifications]);

    const sendLocalNotification = useCallback(async (title: string, body: string, data?: any) => {
        try {
            if (Platform.OS === 'web') {
                // For web, use the Notification API
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(title, {
                        body,
                        icon: '/icon.png', // Add your app icon
                        data,
                    });
                }
            } else {
                // For mobile, use Expo notifications
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title,
                        body,
                        data,
                        sound: true,
                    },
                    trigger: null, // Show immediately
                });
            }
        } catch (error) {
            console.error('Failed to send local notification:', error);
        }
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isLoading,
                requestPermissions,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                refreshNotifications,
                sendLocalNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};