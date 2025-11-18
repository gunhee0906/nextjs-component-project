"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Bell, X, Check, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// 알림 타입 정의
type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// 샘플 알림 데이터
const sampleNotifications: Notification[] = [
  {
    id: 1,
    type: "success",
    title: "프로젝트 배포 완료",
    message: "Portfolio 프로젝트가 성공적으로 배포되었습니다.",
    time: "방금 전",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "새로운 댓글",
    message: "React 게시글에 새로운 댓글이 달렸습니다.",
    time: "5분 전",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "빌드 경고",
    message: "일부 패키지 업데이트가 필요합니다.",
    time: "1시간 전",
    read: true,
  },
  {
    id: 4,
    type: "error",
    title: "API 오류",
    message: "서버 연결에 실패했습니다. 다시 시도해주세요.",
    time: "2시간 전",
    read: true,
  },
];

// 알림 타입별 아이콘 및 스타일
const notificationStyles = {
  info: {
    icon: <Info className="w-5 h-5" />,
    bgColor: "bg-blue-100 dark:bg-blue-950",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  success: {
    icon: <Check className="w-5 h-5" />,
    bgColor: "bg-green-100 dark:bg-green-950",
    textColor: "text-green-600 dark:text-green-400",
  },
  warning: {
    icon: <AlertCircle className="w-5 h-5" />,
    bgColor: "bg-yellow-100 dark:bg-yellow-950",
    textColor: "text-yellow-600 dark:text-yellow-400",
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    bgColor: "bg-red-100 dark:bg-red-950",
    textColor: "text-red-600 dark:text-red-400",
  },
};

export default function NotificationDrawer() {
  const [notifications, setNotifications] =
    useState<Notification[]>(sampleNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[400px] rounded-none">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-xl">알림</DrawerTitle>
                <DrawerDescription>
                  {unreadCount > 0
                    ? `${unreadCount}개의 읽지 않은 알림`
                    : "모든 알림을 확인했습니다"}
                </DrawerDescription>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="w-full mt-2"
              >
                모두 읽음으로 표시
              </Button>
            )}
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Bell className="w-12 h-12 mb-2 opacity-20" />
                <p>알림이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => {
                  const style = notificationStyles[notification.type];
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-accent/50 transition-colors cursor-pointer",
                        !notification.read && "bg-accent/30"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                          )}
                        >
                          {style.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm">
                              {notification.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DrawerFooter className="border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              닫기
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
