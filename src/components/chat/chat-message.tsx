import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Bot, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./item/code-block";
import { useState } from "react";
import { tableToMarkdown } from "@/utils/chat/tableUtils";

interface ChatMessageProps {
  message: MessageType;
  copiedTableId: number | null;
  onCopyTable: (
    tableData: { headers: string[]; rows: string[][] },
    messageId: number
  ) => void;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [localCopiedId, setLocalCopiedId] = useState<string | null>(null);
  const handleTableCopy = async (tableElement: HTMLTableElement) => {
    // HTML 테이블을 파싱하여 데이터 추출
    const headers: string[] = [];
    const rows: string[][] = [];

    // 헤더 추출
    const headerCells = tableElement.querySelectorAll("thead th");
    headerCells.forEach((cell) => {
      headers.push(cell.textContent?.trim() || "");
    });

    // 데이터 행 추출
    const bodyRows = tableElement.querySelectorAll("tbody tr");
    bodyRows.forEach((row) => {
      const rowData: string[] = [];
      const cells = row.querySelectorAll("td");
      cells.forEach((cell) => {
        rowData.push(cell.textContent?.trim() || "");
      });
      if (rowData.length > 0) {
        rows.push(rowData);
      }
    });

    // 마크다운으로 변환
    const markdown = tableToMarkdown({ headers, rows });

    // 클립보드에 복사
    try {
      await navigator.clipboard.writeText(markdown);
      const tableId = `${message.id}-table`;
      setLocalCopiedId(tableId);

      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setLocalCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy table:", error);
    }
  };

  return (
    <div
      className={`py-8 px-4 mb-2 rounded-lg transition-all duration-300 ease-in-out ${
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
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <div className="animate-in fade-in duration-200 leading-8">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // 테이블 커스터마이징
                    table({ children }) {
                      const tableId = `${message.id}-table`;
                      const isCopied = localCopiedId === tableId;

                      return (
                        <div className="my-6 w-full relative group">
                          {/* 복사 버튼 */}
                          <div className="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                const tableElement = e.currentTarget
                                  .closest(".group")
                                  ?.querySelector("table") as HTMLTableElement;
                                if (tableElement) {
                                  handleTableCopy(tableElement);
                                }
                              }}
                              className="gap-2"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                          {/* 테이블 */}
                          <div className="overflow-x-auto rounded-md border">
                            <Table>{children}</Table>
                          </div>
                        </div>
                      );
                    },
                    thead({ children }) {
                      return <TableHeader>{children}</TableHeader>;
                    },
                    tbody({ children }) {
                      return <TableBody>{children}</TableBody>;
                    },
                    tr({ children }) {
                      return <TableRow>{children}</TableRow>;
                    },
                    th({ children }) {
                      return (
                        <TableHead className="font-semibold">
                          {children}
                        </TableHead>
                      );
                    },
                    td({ children }) {
                      return <TableCell>{children}</TableCell>;
                    },
                    // 코드 블록
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");

                      return match ? (
                        <CodeBlock language={match[1]}>{codeString}</CodeBlock>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // 이미지
                    img({ ...props }) {
                      return (
                        <img
                          {...props}
                          className="rounded-lg max-w-full h-auto transition-all duration-300 ease-in-out mt-4"
                          loading="lazy"
                        />
                      );
                    },
                    // 리스트
                    ul: ({ ...props }) => (
                      <ul className="list-disc pl-6" {...props} />
                    ),
                    ol: ({ ...props }) => (
                      <ol className="list-decimal pl-6" {...props} />
                    ),
                    // 헤딩
                    h1: ({ ...props }) => (
                      <h1 className="text-3xl font-bold my-4" {...props} />
                    ),
                    h2: ({ ...props }) => (
                      <h2 className="text-2xl font-semibold my-3" {...props} />
                    ),
                    h3: ({ ...props }) => (
                      <h3 className="text-xl font-semibold my-2" {...props} />
                    ),
                    // 체크박스
                    input: ({ ...props }) => (
                      <input
                        {...props}
                        type="checkbox"
                        className="mr-2 h-4 w-4 accent-blue-500"
                      />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {message.isImageLoading && (
                  <div className="flex flex-col space-y-3 my-4 animate-in fade-in duration-300">
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  </div>
                )}
              </div>
            )}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
