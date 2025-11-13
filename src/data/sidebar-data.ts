import { Home, Folder, Eye, Component, Cpu } from "lucide-react";

// 메뉴 데이터 타입
interface MenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  // {
  //   title: "프로젝트",
  //   url: "/projects",
  //   icon: Folder,
  //   items: [
  //     {
  //       title: "전체 프로젝트",
  //       url: "/projects/all",
  //     },
  //     {
  //       title: "진행중",
  //       url: "/projects/active",
  //       items: [
  //         {
  //           title: "프론트엔드",
  //           url: "/projects/active/frontend",
  //         },
  //         {
  //           title: "백엔드",
  //           url: "/projects/active/backend",
  //         },
  //       ],
  //     },
  //     {
  //       title: "완료됨",
  //       url: "/projects/completed",
  //     },
  //   ],
  // },
  {
    title: "Visual Lab",
    url: "/visual-lab",
    icon: Eye,
  },
  {
    title: "Components Lab",
    url: "/components-lab",
    icon: Component,
  },
  {
    title: "Deep Tech",
    url: "/deep-tech",
    icon: Cpu,
  },
];
