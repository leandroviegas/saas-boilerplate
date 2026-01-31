'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FiBell, FiCheck, FiTrash2, FiInfo, FiAlertCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useTranslation } from '@/hooks/useTranslation';
import { useWebsockets, WsData, wsTypeEnum } from '@/hooks/useWebsockets';
import { getNotifications } from '@/api/generated/notifications/notifications';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface WsNotification extends WsData {
  notification: Notification
}

const notificationApi = getNotifications();

const NotificationDropdown: React.FC = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const response = await notificationApi.getMemberNotifications();
    const data = response.data;
    setNotifications(data);
    setUnreadCount(data.filter((n) => !n.read).length);
  }, [notificationApi]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useWebsockets('notification', (data: WsNotification) => {
    if (data.type === wsTypeEnum.NEW_NOTIFICATION) {
      const newNotification = data.notification;
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast(newNotification.title, {
        description: newNotification.message,
      });
    }
  }, true);

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.putMemberNotificationsIdRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    await notificationApi.putMemberNotificationsReadAll();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id: string) => {
    await notificationApi.deleteMemberNotificationsId(id);
    setNotifications((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      const wasUnread = prev.find((n) => n.id === id && !n.read);
      if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
      return filtered;
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      case 'warning':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'error':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiInfo className="text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <FiBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 overflow-y-auto">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              <FiCheck className="mr-1" /> {t('mark all as read')}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {t('no notifications')}
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "flex flex-col items-start p-3 cursor-default focus:bg-accent",
                !notification.read && "bg-accent/50"
              )}
              onSelect={(e) => e.preventDefault()}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm">{notification.title}</span>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="text-xs text-primary hover:underline mt-1"
                        onClick={() => markAsRead(notification.id)}
                      >
                        {t('view details')}
                      </Link>
                    )}
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => markAsRead(notification.id)}
                      title={t('mark as read')}
                    >
                      <FiCheck className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => deleteNotification(notification.id)}
                    title={t('delete')}
                  >
                    <FiTrash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
