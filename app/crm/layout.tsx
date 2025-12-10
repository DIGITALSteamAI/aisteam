"use client";

import BaseLayout from "../components/BaseLayout";

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BaseLayout>{children}</BaseLayout>;
}

