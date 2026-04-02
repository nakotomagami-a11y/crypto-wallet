"use client";

import { TransactionList } from "@/modules/activity/components/transaction-list";

export default function ActivityPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Activity</h1>
      <TransactionList />
    </div>
  );
}
