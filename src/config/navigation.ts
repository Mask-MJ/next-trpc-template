import type { icons } from "lucide-react";

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof icons;
} & {
  href: string;
  items?: never;
};

export const navigationSidebar: SidebarNavItem[] = [
  { title: "技术文档", href: "/navigation/document", icon: "Album" },
  { title: "优秀博客", href: "/navigation/blog", icon: "Book" },
  { title: "常用工具", href: "/navigation/tool", icon: "Hammer" },
  { title: "资源下载", href: "/navigation/download", icon: "Download" },
  { title: "视频教程", href: "/navigation/video", icon: "Video" },
  { title: "影视资源", href: "/navigation/movie", icon: "Film" },
];
