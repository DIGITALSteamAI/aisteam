"use client";

import BaseLayout from "../components/BaseLayout";

export default function SectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  );
}
