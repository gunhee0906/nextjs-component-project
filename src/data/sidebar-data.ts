import { Home, Settings, Users, Folder, BarChart } from "lucide-react";

// 메뉴 데이터 타입
interface MenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    title: "홈",
    url: "/",
    icon: Home,
  },
  {
    title: "프로젝트",
    url: "/projects",
    icon: Folder,
    items: [
      {
        title: "전체 프로젝트",
        url: "/projects/all",
      },
      {
        title: "진행중",
        url: "/projects/active",
        items: [
          {
            title: "프론트엔드",
            url: "/projects/active/frontend",
          },
          {
            title: "백엔드",
            url: "/projects/active/backend",
          },
        ],
      },
      {
        title: "완료됨",
        url: "/projects/completed",
      },
    ],
  },
  {
    title: "팀",
    url: "/team",
    icon: Users,
  },
  {
    title: "분석",
    url: "/analytics",
    icon: BarChart,
  },
  {
    title: "설정",
    url: "/settings",
    icon: Settings,
  },
];
