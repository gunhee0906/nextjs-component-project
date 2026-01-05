"use client";

import ChatHistory from "@/components/chat/chat-history";
import { ChevronLeft, List } from "lucide-react";
import Link from "next/link";

export default function AIChatHeader({ onClear }: { onClear: Function }) {
  return (
    <div className="border-b px-4 py-3 flex items-center gap-2 flex-shrink-0">
      <Link href="/components-lab">
        <ChevronLeft className="cursor-pointer transition-transform duration-200 hover:-translate-x-1" />
      </Link>
      <h1 className="text-xl font-semibold">SSE + Gemini AI Interface</h1>

      <ChatHistory onClear={onClear} baseUrl={"ai-chat"}>
        <List className="h-5 w-5" />
      </ChatHistory>
    </div>
  );
}
