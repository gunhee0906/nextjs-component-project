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
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useAppSelector } from "@/store/hooks";
import { Label } from "../ui/label";
import {
  useFetchAiChatHistoryListQuery,
  useFetchDeleteAiChatMutation,
} from "@/store/api/ai-chat/aiChatSlice";
import { useParams, useRouter } from "next/navigation";

export default function ChatHistory({
  children,
  onClear,
}: {
  children: React.ReactNode;
  onClear: Function;
}) {
  const router = useRouter();
  const params = useParams();
  const { data: history, refetch } = useFetchAiChatHistoryListQuery();
  const [deleteSession] = useFetchDeleteAiChatMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);
  const chatHistory = history?.history ?? [];

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR");
  };

  const handleNewChatSession = async () => {
    if (user.email) {
      onClear();
      setOpen(false);
    } else {
    }
  };

  const handleDeleteSession = async (chatId: string) => {
    const response = await deleteSession({ conversation: chatId });
    if (response.data.result) {
      refetch();
      onClear();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
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
            <Button
              className="w-full"
              variant="default"
              onClick={handleNewChatSession}
              disabled={user?.email ? false : true}
            >
              <MessageSquare className="mr-2 h-4 w-4" />새 채팅 시작
            </Button>
            {!user?.email && (
              <Label className="text-red-400 relative top-[7px] left-[90px]">
                로그인 후 진행할 수 있습니다.
              </Label>
            )}
          </div>

          <Separator className="my-4" />

          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-2">
              {chatHistory.length > 0 && isLoading ? (
                <HistorySpinnerBox />
              ) : (
                <>
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group relative rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors ${chat?.id === params?.conversation ? "bg-muted" : ""}`}
                      onClick={() => {
                        // 채팅 히스토리 클릭 시 처리
                        router.push(`/components-lab/sse-ai-chat/${chat.id}`);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate mb-1">
                            {chat.title}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {/* {chat.lastMessage} */}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDate(chat.created_at)}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            handleDeleteSession(chat.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {chatHistory.length === 0 && (
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

const HistorySpinnerBox = () => {
  return (
    <>
      <Skeleton className="h-[100px] w-[300px] rounded-xl" />
      <Skeleton className="h-[100px] w-[300px] rounded-xl" />
      <Skeleton className="h-[100px] w-[300px] rounded-xl" />
    </>
  );
};
