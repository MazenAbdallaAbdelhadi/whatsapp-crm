"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { CircleFadingPlus, Smile, PlusIcon, Sparkles } from "lucide-react";
import { SLASH_TEMPLATES } from "../../data/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

export const ComposerInput = () => {
  const [value, setValue] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter templates based on text after the last "/"
  const match = value.match(/\/([^\/]*)$/);
  const query = match ? match[1].toLowerCase() : "";

  const filteredTemplates = SLASH_TEMPLATES.filter(t =>
    t.label.toLowerCase().includes(query) ||
    t.text.toLowerCase().includes(query)
  );

  useEffect(() => {
    if (match && filteredTemplates.length > 0) {
      setShowTemplates(true);
      setSelectedIndex(0);
    } else {
      setShowTemplates(false);
    }
  }, [value, match?.index]);

  const insertTemplate = (text: string) => {
    if (!match) return;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice(match.index! + match[0].length);
    const newValue = prefix + text + " " + suffix;
    setValue(newValue);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showTemplates) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredTemplates.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredTemplates.length) % filteredTemplates.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (filteredTemplates[selectedIndex]) insertTemplate(filteredTemplates[selectedIndex].text);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowTemplates(false);
    }
  };

  return (
    <div className="relative z-20" onKeyDown={handleKeyDown}>
      {showTemplates && filteredTemplates.length > 0 && (
        <Card className="absolute bottom-full mb-4 left-0 w-full max-w-sm p-1 animate-in slide-in-from-bottom-2 fade-in shadow-2xl z-50 overflow-hidden border-border/40 bg-background/80 backdrop-blur-2xl ring-1 ring-border/10">
          <div className="rounded-t-lg px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-2 border-b/50 bg-muted/20">
            <Sparkles className="size-3 text-primary" />
            Reply Templates
          </div>
          <div className="flex flex-col gap-0.5 max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
            {filteredTemplates.map((t, i) => (
              <button
                key={t.id}
                onClick={() => insertTemplate(t.text)}
                className={cn(
                  "flex flex-col items-start gap-0.5 px-3 py-2.5 text-sm rounded-lg text-left transition-all duration-200",
                  i === selectedIndex
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted/80 text-foreground"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-xs tracking-wide">{t.label}</span>
                  {i === selectedIndex && <span className="text-[10px] opacity-70">↵ to select</span>}
                </div>
                <span className={cn("line-clamp-1 text-xs mt-0.5", i === selectedIndex ? "opacity-90" : "text-muted-foreground")}>{t.text}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Premium Input Bar */}
      <div className="flex items-end gap-3 max-w-4xl mx-auto pt-2">
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-full border-border/40 bg-background/50 backdrop-blur hover:bg-background hover:scale-105 transition-all text-muted-foreground shrink-0 shadow-sm">
          <PlusIcon className="size-5" />
        </Button>

        <div className="flex-1 rounded-3xl bg-secondary/20 focus-within:bg-secondary/40 transition-colors duration-200">
          <InputGroup className="items-end gap-2 p-1.5 border-0 shadow-none bg-transparent h-auto">
            <InputGroupTextarea
              ref={textareaRef}
              placeholder="Type a message..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-[44px] py-3 pl-4 max-h-[160px] resize-none bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 text-[15px] leading-relaxed"
            />
            <div className="flex items-center gap-1 pb-1 pr-1">
              <InputGroupButton
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors shrink-0"
              >
                <Smile className="size-5" />
              </InputGroupButton>

              {value.trim() && (
                <InputGroupButton
                  variant="default"
                  size="icon-sm"
                  className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all duration-200 shrink-0 flex items-center justify-center animate-in zoom-in-50 fade-in slide-in-from-bottom-2"
                  onClick={() => setValue("")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </InputGroupButton>
              )}
            </div>
          </InputGroup>
        </div>
      </div>

      <div className="text-center mt-2.5 max-w-4xl mx-auto h-4">
        <p className="flex justify-center gap-1.5 items-center text-[10px] text-muted-foreground/30 select-none transition-opacity hover:opacity-100 duration-300">
          <Sparkles className="size-2.5" />
          <span>Type <Kbd className="font-mono bg-muted/30 px-1 rounded text-foreground/40 border border-border/30"> / </Kbd> for templates</span>
        </p>
      </div>
    </div>
  );
};
