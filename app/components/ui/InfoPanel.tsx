"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type InfoPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
};

export default function InfoPanel({
  open,
  onOpenChange,
  title,
  content,
}: InfoPanelProps) {
  // Simple markdown-like rendering (basic support)
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-4 mt-6 text-slate-900">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-3 mt-5 text-slate-900">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold mb-2 mt-4 text-slate-900">{line.substring(4)}</h3>;
      }
      // Bold
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="text-sm font-semibold mb-2 text-slate-900">{line.replace(/\*\*/g, '')}</p>;
      }
      // Empty lines
      if (line.trim() === '') {
        return <br key={index} />;
      }
      // Regular paragraphs
      return <p key={index} className="text-sm text-slate-700 mb-3 leading-relaxed">{line}</p>;
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {renderContent(content)}
        </div>
      </SheetContent>
    </Sheet>
  );
}

