"use client";
import { useState, useRef, useEffect, forwardRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const HtmlEditor = forwardRef(({ value, onChange }, ref) => {
  const [activeTab, setActiveTab] = useState("code");
  const textareaRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Expose the internal ref to parent component
  useEffect(() => {
    if (ref) {
      ref.current = textareaRef.current;
    }
  }, [ref]);

  // Track cursor position when textarea is focused or selection changes
  const handleSelect = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  // Update value with cursor position tracking
  const handleChange = (e) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  return (
    <div className="border rounded-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="code">HTML Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="p-4 overflow-scroll">
          <Textarea
            ref={textareaRef}
            placeholder="Enter HTML content here..."
            className="min-h-[200px] max-h-[400px] font-mono text-sm "
            value={value}
            onChange={handleChange}
            onSelect={handleSelect}
            onClick={handleSelect}
            onKeyUp={handleSelect}
          />
        </TabsContent>

        <TabsContent
          value="preview"
          className="p-4 max-h-[400px] border-t overflow-scroll"
        >
          {value ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div className="text-gray-400 italic">
              HTML preview will appear here...
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
});

HtmlEditor.displayName = "HtmlEditor";
