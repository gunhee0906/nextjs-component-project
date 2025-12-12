import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import TableMessage from "../chat/item/table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useRef } from "react";

interface ChatMessageProps {
  message: MessageType;
  copiedTableId: number | null;
  onCopyTable: (
    tableData: { headers: string[]; rows: string[][] },
    messageId: number
  ) => void;
  onReask?: (selectedText: string) => void;
}

export default function AIChatMessage({
  message,
  copiedTableId,
  onCopyTable,
}: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={messageRef}
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
                  {message.type === "table" && message.tableData ? (
                    <TableMessage
                      tableData={message.tableData}
                      isCopied={copiedTableId === message.id}
                      onCopy={() => onCopyTable(message.tableData!, message.id)}
                    />
                  ) : message.type === "table" && message.content ? (
                    <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded">
                      {message.content}
                    </div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table({ children }) {
                          return (
                            <div className="my-6 w-full relative group">
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
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const codeString = String(children).replace(
                            /\n$/,
                            ""
                          );

                          return match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-md my-4"
                              customStyle={{
                                margin: 0,
                                borderRadius: "0.375rem",
                              }}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                        img({ ...props }) {
                          return (
                            <img
                              {...props}
                              className="rounded-lg max-w-full h-auto transition-all duration-300 ease-in-out mt-4"
                              loading="lazy"
                            />
                          );
                        },
                        ul: ({ ...props }) => (
                          <ul className="list-disc pl-6" {...props} />
                        ),
                        ol: ({ ...props }) => (
                          <ol className="list-decimal pl-6" {...props} />
                        ),
                        h1: ({ ...props }) => (
                          <h1 className="text-3xl font-bold my-4" {...props} />
                        ),
                        h2: ({ ...props }) => (
                          <h2
                            className="text-2xl font-semibold my-3"
                            {...props}
                          />
                        ),
                        h3: ({ ...props }) => (
                          <h3
                            className="text-xl font-semibold my-2"
                            {...props}
                          />
                        ),
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
                  )}
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
    </>
  );
}
