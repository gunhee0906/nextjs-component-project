// 채팅 메세지 타입
interface MessageType {
  id: number;
  type: "text" | "table";
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
  isImageLoading?: boolean;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

// 채팅 히스토리 타입 (예시)
interface ChatHistory2 {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  created_at: Date;
  deleted_at: Date;
  updated_at: Date;
  user_id: string;
}
