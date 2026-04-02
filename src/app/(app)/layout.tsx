"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PAGE_ROUTES } from "@/lib/routes";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLocked = useWalletStore((s) => s.isLocked);

  useEffect(() => {
    if (isLocked) {
      router.replace(PAGE_ROUTES.unlock);
    }
  }, [isLocked, router]);

  if (isLocked) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
