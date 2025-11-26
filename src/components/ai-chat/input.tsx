"use client";
import { CircleStop, Send } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useRef } from "react";
interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}
export default function AIChatInput({
  value,
  onChange,
  onSend,
  isLoading,
}: Props) {
  const focusRef = useRef<HTMLTextAreaElement | null>(null);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <>
      <div className="p-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2">
            <Textarea
              ref={focusRef}
              placeholder="메시지를 입력하세요..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="min-h-[60px] max-h-[200px] resize-none pr-12"
              rows={1}
            />
            <Button
              onClick={() => onSend()}
              size="icon"
              disabled={!value.trim()}
              className="absolute right-2 bottom-2"
            >
              {!value.trim() || isLoading ? (
                <Send className="h-4 w-4" />
              ) : (
                <CircleStop className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
