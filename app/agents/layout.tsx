"use client";

import BaseLayout from "../components/BaseLayout";

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout headerTitle="Agents">
      {children}
    </BaseLayout>
  );
}

