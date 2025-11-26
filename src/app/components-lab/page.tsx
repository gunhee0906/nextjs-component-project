import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

const projects: ProjectItem[] = [
  {
    id: "1",
    title: "SSE AI Chat [Dumie Data]",
    description: "SSE 통신을 활용한 Dumie Data AI 채팅",
    imageUrl: "/images/sse-ai-chat.png",
    url: "/components-lab/sse-ai-chat",
  },
  {
    id: "2",
    title: "SSE AI Chat [Gemini AI API]",
    description: "SSE 통신을 활용한 Gemini AI 연동",
    imageUrl: "/images/sse-ai-chat.png",
    url: "/components-lab/ai-chat",
  },
];

export default function ComponentsLabPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {projects.map((project) => (
        <Link href={project.url}>
          <Card
            key={project.id}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
