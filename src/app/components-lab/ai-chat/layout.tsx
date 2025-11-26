import AiChatInterface from "@/components/ai-chat/interface";

export default function AIChatLayout({
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
