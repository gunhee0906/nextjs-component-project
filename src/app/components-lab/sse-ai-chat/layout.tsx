import AiChatInterface from "@/components/chat/interface";

export default function SSEAiChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AiChatInterface>{children}</AiChatInterface>
    </>
  );
}
