import "./globals.css";
import React from "react";
import { AssistantProvider } from "./assistant/AssistantProvider";

export const metadata = {
  title: "AISTEAM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900">
        <AssistantProvider>
          {children}
        </AssistantProvider>
      </body>
    </html>
  );
}
