// app/assistantPopout/layout.tsx

export const metadata = {
  title: "AISTEAM Assistant Popout",
};

export default function AssistantPopoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No html/body here, root layout already provides them
  return <>{children}</>;
}
