import axios from "axios";
export async function generateMetadata({ params }: { params: any }) {
  const { conversation } = params;
  console.log(conversation);
  const result = await axios.get(
    `http://localhost:4000/api/ai-chat/get-chat-title?conversation=${conversation}`
  );

  console.log(result.data.title);

  return {
    title: result.data.title,
  };
}
export default async function AIChatConversationPage() {
  return <></>;
}
