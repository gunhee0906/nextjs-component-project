"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Loader2 } from "lucide-react";
import ChatHeader from "./chat-header";
import { tableToMarkdown } from "@/utils/chat/tableUtils";
import ChatInput from "./chat-input";
import ChatMessage from "./chat-message";
import { useChatStream } from "@/hooks/useChatStream";

export default function AiChatInterface() {
  const { messages, setMessages, streamResponse } = useChatStream();
  const focusRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTableId, setCopiedTableId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

      await streamResponse(assistantMessageId, currentInput);
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

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background">
      {/* 채팅 헤더 영역 */}
      <ChatHeader />

      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto mt-4">
          {messages.map((message) => (
            // 채팅 메세지 영역
            <ChatMessage
              key={message.id}
              message={message}
              copiedTableId={copiedTableId}
              onCopyTable={handleCopyTable}
            />
          ))}
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
      </div>
      {/* 채팅 입력 영역 */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}
