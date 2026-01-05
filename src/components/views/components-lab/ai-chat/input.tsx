"use client";
import { CirclePlus, Mic, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

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
  const [voiceMessage, setVoiceMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Web Speech API 초기화
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "ko-KR";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setVoiceMessage(transcript);
          // 음성 인식 결과를 onChange로 전달
          onChange(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onChange]);

  // 음성 메시지가 설정되면 자동으로 전송
  useEffect(() => {
    if (voiceMessage && !isListening) {
      // 약간의 딜레이 후 전송 (사용자가 결과를 확인할 수 있도록)
      const timer = setTimeout(() => {
        onSend();
        setVoiceMessage(""); // 전송 후 초기화
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [voiceMessage, isListening, onSend]);

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } else {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
    }
  };

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
    <div className="w-full px-4 pb-6 pt-4">
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
                className={`h-9 w-9 rounded-full ${
                  isListening
                    ? "bg-red-100 dark:bg-red-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={handleVoiceInput}
              >
                <Mic
                  className={`h-5 w-5 ${
                    isListening
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
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
        {/* 
        <div>Voice Message : {voiceMessage}</div> */}
        {isListening && <div className="text-red-500 mt-2">듣는 중...</div>}

        {/* Optional: Character count or helper text */}
      </div>
    </div>
  );
}
