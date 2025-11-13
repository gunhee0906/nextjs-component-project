"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Message = {
  id: number;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
};

export default function AiChatInterface() {
  const focusRef = useRef<HTMLTextAreaElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "안녕하세요! 무엇을 도와드릴까요?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now(),
        content: inputValue,
        role: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      const assistantMessageId = Date.now() + 1;
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      await streamResponse(assistantMessageId);
      setIsLoading(false);

      setTimeout(() => {
        focusRef.current?.focus();
      }, 100);
    }
  };

  const streamResponse = async (messageId: number) => {
    // 마크다운 예시 포함
    const sseDataChunks = [
      { content: "## " },
      { content: "응답 " },
      { content: "예시\n\n" },
      { content: "여기에 " },
      { content: "**마크다운**" },
      { content: " 형식의 " },
      { content: "텍스트가 " },
      { content: "들어갑니다.\n\n" },
      { content: "### " },
      { content: "이미지 예시\n" },
      {
        content:
          "![샘플 이미지](https://www.adobe.com/kr/products/firefly/features/media_156f60527ad304e5d5cc92b1c934b381d6ff0625c.jpg?width=750&format=jpg&optimize=medium)\n\n",
      },
      { content: "### " },
      { content: "코드 블록\n" },
      { content: "```javascript\n" },
      { content: "const hello = 'world';\n" },
      { content: "console.log(hello);\n" },
      { content: "```\n\n" },
      { content: "- 리스트 항목 1\n" },
      { content: "- 리스트 항목 2\n" },
      { content: "- 리스트 항목 3\n" },
    ];

    for (const chunk of sseDataChunks) {
      await new Promise((resolve) => setTimeout(resolve, 150));

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: msg.content + chunk.content }
            : msg
        )
      );
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background">
      <div className="border-b px-4 py-3 flex-shrink-0">
        <h1 className="text-xl font-semibold">SSE + AI Chat Interface</h1>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto mt-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`py-8 px-4 rounded-lg ${
                message.role === "assistant" ? "bg-muted/50" : ""
              }`}
            >
              <div className="max-w-3xl mx-auto flex gap-4">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {message.role === "user" ? (
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-primary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-sm">
                    {message.role === "user" ? "You" : "AI"}
                  </p>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {message.role === "user" ? (
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                          img({ node, ...props }) {
                            return (
                              <img
                                {...props}
                                className="rounded-lg max-w-full h-auto"
                                loading="lazy"
                              />
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="py-8 px-4 bg-muted/50">
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

      <div className="border-t p-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2">
            <Textarea
              ref={focusRef}
              placeholder="메시지를 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="min-h-[60px] max-h-[200px] resize-none pr-12"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="absolute right-2 bottom-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
