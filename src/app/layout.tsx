import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { BookOpen, Layers, Network, MessageSquare, BarChart3, Settings } from "lucide-react";
import { StudyFooter } from "@/components/StudyFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "研究生考试备考系统",
  description: "基础医学研究生考试智能备考平台",
};

const navItems = [
  { href: "/learn", label: "学习路径", icon: BookOpen },
  { href: "/flashcards", label: "闪卡", icon: Layers },
  { href: "/mechanism", label: "机制图谱", icon: Network },
  { href: "/interview", label: "面试", icon: MessageSquare },
  { href: "/progress", label: "进度", icon: BarChart3 },
  { href: "/settings", label: "设置", icon: Settings },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <nav className="container mx-auto flex h-14 items-center px-4">
            <Link href="/" className="mr-8 flex items-center gap-2 font-bold">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>医学备考</span>
            </Link>
            <div className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur">
          <StudyFooter />
        </footer>
      </body>
    </html>
  );
}
