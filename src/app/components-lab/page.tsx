import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Components Lab",
};

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  category: string;
  tags?: string[];
}

const projects: ProjectItem[] = [
  {
    id: "1",
    title: "SSE AI Chat [Gemini AI API]",
    description: "SSE 통신을 활용한 Gemini AI 연동",
    imageUrl: "/images/sse-ai-chat.png",
    url: "/components-lab/ai-chat",
    category: "Real-time Communication",
    tags: ["SSE", "AI", "Gemini"],
  },
  {
    id: "2",
    title: "SSE AI Chat [Dummy Data]",
    description: "SSE 통신을 활용한 Dummy Data AI 채팅",
    imageUrl: "/images/sse-ai-chat.png",
    url: "/components-lab/sse-ai-chat",
    category: "Real-time Communication",
    tags: ["SSE", "Streaming", "Chat"],
  },
  {
    id: "3",
    title: "Drag & Drop File Uploader",
    description: "드래그 앤 드롭으로 파일 업로드 및 미리보기",
    imageUrl: "/images/file-upload.png",
    url: "/components-lab/file-upload",
    category: "File & Data Handling",
    tags: ["Drag & Drop", "Upload", "Preview"],
  },
  {
    id: "4",
    title: "Calendar",
    description: "Full Calendar 라이브러리를 적용한 일정 관리",
    imageUrl: "/images/file-upload.png",
    url: "/components-lab/calendar",
    category: "Calendar",
    tags: ["calendar"],
  },
];

// 카테고리별로 프로젝트 그룹화
const groupedProjects = projects.reduce(
  (acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  },
  {} as Record<string, ProjectItem[]>
);

export default function ComponentsLabPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      {/* 헤더 섹션 */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 ">Components Lab</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          실무에서 활용 가능한 다양한 컴포넌트와 기능을 실험하고 구현합니다.
          실시간 통신, 파일 처리, UI/UX 인터랙션 등 현대 웹 개발의 핵심 기술들을
          직접 구현하고 테스트합니다.
        </p>

        {/* 통계 정보 (선택사항) */}
        <div className="flex gap-6 mt-6 text-sm">
          <div>
            <span className="font-semibold text-foreground">
              {Object.keys(groupedProjects).length}
            </span>
            <span className="text-muted-foreground ml-1">Categories</span>
          </div>
          <div>
            <span className="font-semibold text-foreground">
              {projects.length}
            </span>
            <span className="text-muted-foreground ml-1">Projects</span>
          </div>
        </div>
      </div>

      {/* 카테고리별 프로젝트 리스트 */}
      <div className="space-y-12">
        {Object.entries(groupedProjects).map(([category, categoryProjects]) => (
          <section key={category}>
            <div className="mb-6">
              <div className="inline-flex flex-col">
                <h2 className="text-2xl font-semibold mb-2">{category}</h2>
                <div className="h-1 bg-gradient-to-r from-slate-400 to-purple-400 rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProjects.map((project) => (
                <Link key={project.id} href={project.url}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 h-full">
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-3">
                      <CardTitle className="line-clamp-1 text-xl">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mb-3">
                        {project.description}
                      </CardDescription>

                      {/* 태그 */}
                      {project.tags && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Coming Soon 섹션 (선택사항) */}
      <section className="mt-16 p-8 rounded-lg border-2 border-dashed border-muted-foreground/30 text-center">
        <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
          더 많은 컴포넌트 준비 중
        </h3>
        <p className="text-sm text-muted-foreground">
          드래그 앤 드롭, 무한 스크롤, 코드 에디터 등 다양한 컴포넌트가 추가될
          예정입니다.
        </p>
      </section>
    </div>
  );
}
