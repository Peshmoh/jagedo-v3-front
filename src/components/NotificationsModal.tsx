/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { X, Bell, Check, Trash2, Settings, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string | number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  category?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string | number) => void;
  onMarkAllAsRead?: () => void;
  onDeleteNotification?: (notificationId: string | number) => void;
  onClearAll?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
}) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="h-4 w-4 text-emerald-600" />
          </div>
        );
      case 'warning':
        return (
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-600 text-sm font-medium">!</span>
          </div>
        );
      case 'error':
        return (
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <X className="h-4 w-4 text-red-600" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Bell className="h-4 w-4 text-blue-600" />
          </div>
        );
    }
  };

  const getNotificationAccent = (type?: string) => {
    switch (type) {
      case 'success':
        return 'border-l-emerald-400';
      case 'warning':
        return 'border-l-amber-400';
      case 'error':
        return 'border-l-red-400';
      default:
        return 'border-l-blue-400';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 w-screen h-screen z-50 bg-black/20 backdrop-blur-md flex items-center justify-center"

        onClick={onClose}
      />

      {/* Modal */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 transform transition-all duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              {unreadNotifications.length > 0 && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {unreadNotifications.length} unread message{unreadNotifications.length === 1 ? '' : 's'}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* Action Bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-50 bg-gray-50/50 bg-white">
            <div className="flex items-center gap-3">
              {onMarkAllAsRead && unreadNotifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="h-8 px-3 text-xs font-medium border-gray-200 hover:bg-white hover:border-blue-300 hover:text-blue-700 transition-all"
                >
                  <Check className="h-3 w-3 mr-1.5" />
                  Mark all read
                </Button>
              )}
              {onClearAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="h-8 px-3 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-3 w-3 mr-1.5" />
                  Clear all
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-white">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center px-6">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="h-full flex flex-col">
              <div className="px-6 pt-4 pb-2">
                <TabsList className="grid w-full grid-cols-3 h-10 bg-gray-100/80 rounded-lg p-1">
                  <TabsTrigger
                    value="all"
                    className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  >
                    All ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  >
                    Unread ({unreadNotifications.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="read"
                    className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  >
                    Read ({readNotifications.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="flex-1 mt-0 bg-white mb-20">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="px-6 pb-10 space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${!notification.read
                          ? `bg-blue-50/50 hover:bg-blue-50 border-l-4 ${getNotificationAccent(notification.type)}`
                          : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={!notification.read ? '' : 'opacity-60'}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className={`font-medium text-sm leading-5 ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full ml-3 mt-2 flex-shrink-0"></div>
                              )}
                            </div>
                            <p className={`text-sm leading-5 mb-3 ${!notification.read ? 'text-gray-600' : 'text-gray-500'}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-400 font-medium">{notification.time}</p>
                              {notification.category && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs h-5 px-2 ${!notification.read ? 'border-gray-200 text-gray-600' : 'border-gray-200 text-gray-500 opacity-75'}`}
                                >
                                  {notification.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {onDeleteNotification && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteNotification(notification.id);
                              }}
                              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all rounded-full flex-shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="unread" className="flex-1 mt-0">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="px-6 pb-10 space-y-1">
                    {unreadNotifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                          <Check className="h-6 w-6 text-emerald-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">All caught up!</p>
                        <p className="text-sm text-gray-500">No unread notifications</p>
                      </div>
                    ) : (
                      unreadNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 bg-blue-50/50 hover:bg-blue-50 border-l-4 ${getNotificationAccent(notification.type)}`}
                        >
                          <div className="flex items-start gap-4">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="font-medium text-sm text-gray-900 leading-5">
                                  {notification.title}
                                </h4>
                                <div className="h-2 w-2 bg-blue-500 rounded-full ml-3 mt-2 flex-shrink-0"></div>
                              </div>
                              <p className="text-sm text-gray-600 leading-5 mb-3">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400 font-medium">{notification.time}</p>
                                {notification.category && (
                                  <Badge variant="outline" className="text-xs h-5 px-2 border-gray-200 text-gray-600">
                                    {notification.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="read" className="flex-1 mt-0">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="px-6 pb-10 space-y-1">
                    {readNotifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <Bell className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">No read notifications</p>
                        <p className="text-sm text-gray-500">Read notifications will appear here</p>
                      </div>
                    ) : (
                      readNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className="group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50"
                        >
                          <div className="flex items-start gap-4">
                            <div className="opacity-60">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-600 mb-1 leading-5">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-500 leading-5 mb-3">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400 font-medium">{notification.time}</p>
                                {notification.category && (
                                  <Badge variant="outline" className="text-xs h-5 px-2 border-gray-200 text-gray-500 opacity-75">
                                    {notification.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </>
  );
};