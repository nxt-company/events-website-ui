
import { ReactNode } from "react";
import { MainNavbar } from "./MainNavbar";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavbar />
      <main className="flex-1 container py-6 md:py-10 mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
