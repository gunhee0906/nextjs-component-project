import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useState } from "react";

export default function ChatHistory({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  // 예시 데이터 - 실제로는 props나 context에서 받아올 수 있습니다
  const chatHistories: ChatHistory[] = [
    {
      id: "1",
      title: "프로젝트 코드 리뷰",
      lastMessage: "React 컴포넌트 분리에 대해...",
      timestamp: new Date(2024, 10, 18, 14, 30),
    },
    {
      id: "2",
      title: "API 통합 질문",
      lastMessage: "SSE 스트리밍 구현 방법...",
      timestamp: new Date(2024, 10, 18, 10, 15),
    },
    {
      id: "3",
      title: "디자인 시스템 논의",
      lastMessage: "Tailwind CSS 커스터마이징...",
      timestamp: new Date(2024, 10, 17, 16, 45),
    },
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "방금 전";
    if (hours < 24) return `${hours}시간 전`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString("ko-KR");
  };
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto">
            {children}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>채팅 히스토리</SheetTitle>
            <SheetDescription>
              이전 대화 내역을 확인하고 계속 이어갈 수 있습니다.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <Button className="w-full" variant="default">
              <MessageSquare className="mr-2 h-4 w-4" />새 채팅 시작
            </Button>
          </div>

          <Separator className="my-4" />

          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-2">
              {chatHistories.map((chat) => (
                <div
                  key={chat.id}
                  className="group relative rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    // 채팅 히스토리 클릭 시 처리
                    console.log("Selected chat:", chat.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate mb-1">
                        {chat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(chat.timestamp)}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 삭제 처리
                        console.log("Delete chat:", chat.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {chatHistories.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">아직 채팅 히스토리가 없습니다</p>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
