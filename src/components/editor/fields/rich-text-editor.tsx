'use client';

import { useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Heading3, Type, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Clean HTML output from contentEditable - remove unnecessary styling
 */
function cleanHtml(html: string): string {
  return html
    // Remove inline styles (but keep the tags)
    .replace(/\s*style="[^"]*"/gi, '')
    // Remove font tags
    .replace(/<\/?font[^>]*>/gi, '')
    // Remove empty spans (but keep non-empty ones)
    .replace(/<span[^>]*>\s*<\/span>/gi, '')
    // Clean up multiple BRs (limit to 2)
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>')
    // Remove &nbsp; at the end of divs (contentEditable adds these for empty lines)
    .replace(/<div>\s*&nbsp;\s*<\/div>/gi, '<div><br></div>')
    .replace(/&nbsp;/gi, ' ');
}

/**
 * A simple rich text editor supporting bold, italic, underline, lists, headings, and alignment.
 * Stores content as cleaned HTML.
 */
export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const lastKnownValueRef = useRef(value);

  // Initialize content on mount
  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current) {
      editorRef.current.innerHTML = value || '';
      isInitializedRef.current = true;
      lastKnownValueRef.current = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const rawContent = editorRef.current.innerHTML;
      const cleaned = cleanHtml(rawContent);
      lastKnownValueRef.current = rawContent;
      onChange(cleaned);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    setTimeout(handleInput, 0);
  };

  const insertList = (ordered: boolean) => {
    const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
    execCommand(command);
  };

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', tag);
  };

  const clearFormatting = () => {
    document.execCommand('removeFormat', false, '');
    if (editorRef.current) {
      // Convert any block formatting back to paragraph
      const formatBlocks = editorRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6, pre');
      formatBlocks.forEach((block) => {
        const newP = document.createElement('p');
        newP.innerHTML = block.innerHTML;
        block.parentNode?.replaceChild(newP, block);
      });
    }
    setTimeout(handleInput, 0);
  };

  const toolbarButtonClass = (
    active: boolean
  ) => `h-7 w-7 p-0 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${
    active ? 'bg-zinc-200 dark:bg-zinc-600' : ''
  }`;

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
        {/* Text Format */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); formatBlock('p'); }}
          title="Normal text"
        >
          <Type className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); formatBlock('h3'); }}
          title="Large heading"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); formatBlock('h4'); }}
          title="Medium heading"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); insertList(false); }}
          title="Bullet list"
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); insertList(true); }}
          title="Numbered list"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); execCommand('justifyLeft'); }}
          title="Align left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); execCommand('justifyCenter'); }}
          title="Align center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Clear */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={toolbarButtonClass(false)}
          onMouseDown={(e) => { e.preventDefault(); clearFormatting(); }}
          title="Clear formatting"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="min-h-[120px] max-h-[300px] overflow-y-auto p-3 text-sm outline-none summary-content rich-text-editor"
        data-placeholder={placeholder || 'Enter your content...'}
        suppressContentEditableWarning
      />

      <style>{`
        .rich-text-editor:empty:before {
          content: attr(data-placeholder);
          color: #a1a1aa;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
