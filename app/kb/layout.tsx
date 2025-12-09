"use client";

import BaseLayout from "../components/BaseLayout";

export default function KBLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout headerTitle="Knowledge Base">
      {children}
    </BaseLayout>
  );
}
