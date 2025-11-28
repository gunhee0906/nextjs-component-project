import { useLazyFetchAiChatHistoryListQuery } from "@/store/api/ai-chat/aiChatSlice";
import { parseMarkdownTable } from "@/utils/chat/tableUtils";
import { useParams } from "next/navigation";
import { useState } from "react";

export const useAIStream = () => {
  const [trigger] = useLazyFetchAiChatHistoryListQuery();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const params = useParams();
  console.log(params?.conversation);

  const streamResponse = async (
    messageId: number,
    inputValue: string,
    currentConversation: string
  ) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/ai-chat/ge-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            message: inputValue,
            conversation: currentConversation,
          }),
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
                break;
              }
            }

            try {
              const chunk = JSON.parse(data);

              // Gemini 응답 형식: { text: "안녕하세요" }
              const text = chunk.text || "";

              if (!text) continue;

              // 일반 텍스트 스트리밍 (단어별로 출력)
              const words = text.split(/(\s+)/);
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
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
      trigger();
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
