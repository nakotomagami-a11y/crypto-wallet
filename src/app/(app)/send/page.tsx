"use client";

import { SendForm } from "@/modules/send/components/send-form";

export default function SendPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Send</h1>
      <SendForm />
    </div>
  );
}
