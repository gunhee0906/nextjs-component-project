"use client";

import { ChevronLeft, List } from "lucide-react";
import ChatHistory from "./chat-history";
import Link from "next/link";

export default function ChatHeader() {
  return (
    <div className="border-b px-4 py-3 flex items-center gap-2 flex-shrink-0">
      <Link href="/components-lab">
        <ChevronLeft className="cursor-pointer transition-transform duration-200 hover:-translate-x-1" />
      </Link>
      <h1 className="text-xl font-semibold">SSE + AI Chat Interface</h1>
      <h1 className="text-xl font-semibold">[새로운 채팅]</h1>

      <ChatHistory>
        <List className="h-5 w-5" />
      </ChatHistory>
    </div>
  );
}
