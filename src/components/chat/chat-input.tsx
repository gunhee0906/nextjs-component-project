"use client";
import { CirclePlus, Mic, Send, Square } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isLoading,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend();
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="w-full px-4 pb-6 pt-2">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-white dark:bg-gray-800 rounded-[26px] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          {/* Left Icon Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-3 bottom-3 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              /* 파일 첨부 기능 */
            }}
          >
            <CirclePlus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>

          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            placeholder="무엇이든 물어보세요"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent px-14 py-3.5 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            rows={1}
          />

          {/* Right Action Buttons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {!value.trim() ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  /* 음성 입력 기능 */
                }}
              >
                <Mic className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            ) : (
              <Button
                onClick={onSend}
                size="icon"
                disabled={isLoading || !value.trim()}
                className="h-9 w-9 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Square className="h-4 w-4 fill-current" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Optional: Character count or helper text */}
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          정보가 정확하지 않을 수 있습니다.
        </div>
      </div>
    </div>
  );
}
