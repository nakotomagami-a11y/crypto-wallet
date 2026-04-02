"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasVault } from "@/modules/wallet/utils/crypto";
import { PAGE_ROUTES } from "@/lib/routes";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (hasVault()) {
      router.replace(PAGE_ROUTES.unlock);
    } else {
      router.replace(PAGE_ROUTES.create);
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
