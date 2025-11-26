"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Loader2 } from "lucide-react";
import { tableToMarkdown } from "@/utils/chat/tableUtils";
import {
  useFetchNewAiChatMutation,
  useLazyFetchAiChatContentQuery,
} from "@/store/api/ai-chat/aiChatSlice";
import { useParams, useRouter } from "next/navigation";
import AIChatHeader from "./header";
import AIChatMessage from "./message";
import AIChatInput from "./input";
import { AIChatEmpty } from "./empty";
import { useAIStream } from "@/hooks/useAiStream";

export default function AiChatInterface({
  children,
}: {
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const { messages, setMessages, streamResponse } = useAIStream();
  const focusRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTableId, setCopiedTableId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [setNewSession] = useFetchNewAiChatMutation();
  const isNewSessionRef = useRef(false); // isNew를 ref로 변경
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 메세지 전송 Event Handler
  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage: MessageType = {
        id: Date.now(),
        type: "text",
        content: inputValue,
        role: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      const currentInput = inputValue;
      setInputValue("");
      setIsLoading(true);

      let currentConversation = params?.conversation as string;

      if (!params?.conversation) {
        isNewSessionRef.current = true;
        const result = await setNewSession({ title: currentInput });
        if (result.data.result) {
          currentConversation = result.data?.converstaionId;
          router.push(`/components-lab/ai-chat/${result.data.converstaionId}`);
        }
      }
      const assistantMessageId = Date.now() + 1;
      // 응답을 받기 위한 빈 메세지 생성
      const assistantMessage: MessageType = {
        id: assistantMessageId,
        type: "text",
        content: "",
        role: "assistant",
        timestamp: new Date(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      await streamResponse(
        assistantMessageId,
        currentInput,
        currentConversation
      );
      isNewSessionRef.current = false;
      setIsLoading(false);

      setTimeout(() => {
        focusRef.current?.focus();
      }, 100);
    }
  };

  // 테이블 복사 Event Handler
  const handleCopyTable = async (
    tableData: { headers: string[]; rows: string[][] },
    messageId: number
  ) => {
    const markdown = tableToMarkdown(tableData);

    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedTableId(messageId);

      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setCopiedTableId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy table:", error);
    }
  };
  const [trigger, { data }] = useLazyFetchAiChatContentQuery();

  useEffect(() => {
    if (data?.messages?.length > 0) {
      setMessages(data?.messages);
    }
  }, [data]);

  useEffect(() => {
    // 새 세션이 아니고, conversation이 존재할 때만 trigger 실행
    if (params?.conversation && !isNewSessionRef.current) {
      trigger({ conversation: params?.conversation });
    }
  }, [params?.conversation, trigger]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background">
      {/* 채팅 헤더 영역 */}
      <AIChatHeader />
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
        {children}
        <div className="max-w-4xl mx-auto mt-4">
          {messages.length > 0 &&
            messages.map((message) => (
              // 채팅 메세지 영역
              <AIChatMessage
                key={message.id}
                message={message}
                copiedTableId={copiedTableId}
                onCopyTable={handleCopyTable}
              />
            ))}
          {messages.length === 0 && <AIChatEmpty />}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="py-8 px-4 bg-muted/50 animate-in fade-in duration-300">
              <div className="max-w-3xl mx-auto flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-sm">AI</p>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            </div>
          )}
        </div>
        {messages?.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl px-4">
              <AIChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSend}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
      {messages?.length > 0 && (
        <AIChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
