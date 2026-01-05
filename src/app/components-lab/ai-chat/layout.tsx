import AiChatInterface from "@/components/views/components-lab/ai-chat/interface";

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
