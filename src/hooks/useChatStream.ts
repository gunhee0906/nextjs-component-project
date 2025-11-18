import { parseMarkdownTable } from "@/utils/chat/tableUtils";
import { useState } from "react";

export const useChatStream = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      type: "text",
      content: "안녕하세요! 무엇을 도와드릴까요?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);

  const streamResponse = async (messageId: number, inputValue: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/ai-chat?msg=${inputValue}`,
        {
          method: "GET",
          headers: {
            Accept: "text/event-stream",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is not readable");
      }

      let buffer = "";
      let tableBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              if (tableBuffer) {
                const parsedTable = parseMarkdownTable(tableBuffer);
                if (parsedTable) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === messageId
                        ? {
                            ...msg,
                            type: "table",
                            tableData: parsedTable,
                            isStreaming: false,
                          }
                        : msg
                    )
                  );
                }
              } else {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === messageId ? { ...msg, isStreaming: false } : msg
                  )
                );
              }
              break;
            }

            try {
              const chunk = JSON.parse(data);

              if (chunk.type === "image") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === messageId
                      ? { ...msg, isImageLoading: true }
                      : msg
                  )
                );

                await new Promise((resolve) => setTimeout(resolve, 3000));

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === messageId
                      ? {
                          ...msg,
                          content: msg.content + chunk.content,
                          isImageLoading: false,
                        }
                      : msg
                  )
                );
              } else if (chunk.type === "table") {
                tableBuffer += chunk.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === messageId
                      ? {
                          ...msg,
                          type: "table",
                          content: tableBuffer,
                        }
                      : msg
                  )
                );
                await new Promise((resolve) => setTimeout(resolve, 50));
              } else {
                const words = chunk.content.split(/(\s+)/);
                for (const word of words) {
                  if (word === "") continue;

                  const baseDelay = 40;
                  const randomDelay = Math.random() * 30;
                  await new Promise((resolve) =>
                    setTimeout(resolve, baseDelay + randomDelay)
                  );

                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === messageId
                        ? {
                            ...msg,
                            content: msg.content + word,
                          }
                        : msg
                    )
                  );
                }
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: "오류가 발생했습니다. 다시 시도해주세요.",
                isStreaming: false,
              }
            : msg
        )
      );
    }
  };

  return { messages, setMessages, streamResponse };
};
