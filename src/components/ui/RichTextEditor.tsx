import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Button from "./Button";
import { Bold, Italic, List, ListOrdered, Heading2, Undo2, Redo2 } from "lucide-react";

export default function RichTextEditor({
  label,
  value,
  onChange,
  error,
}: {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  error?: string;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p></p>",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[160px] rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,.06)] px-3 py-2 text-sm outline-none focus-within:ring-4 focus-within:ring-[var(--ring)]",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    // avoid loops: only update if different
    const html = editor.getHTML();
    if (value && html !== value) editor.commands.setContent(value, false);
  }, [value, editor]);

  return (
    <div className="space-y-1">
      {label ? <div className="label">{label}</div> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleBold().run()} leftIcon={<Bold className="h-4 w-4" />}>
          Bold
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleItalic().run()} leftIcon={<Italic className="h-4 w-4" />}>
          Italic
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} leftIcon={<Heading2 className="h-4 w-4" />}>
          H2
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleBulletList().run()} leftIcon={<List className="h-4 w-4" />}>
          Bullet
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleOrderedList().run()} leftIcon={<ListOrdered className="h-4 w-4" />}>
          Ordered
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().undo().run()} leftIcon={<Undo2 className="h-4 w-4" />}>
          Undo
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().redo().run()} leftIcon={<Redo2 className="h-4 w-4" />}>
          Redo
        </Button>
      </div>

      <EditorContent editor={editor} />

      {error ? <div className="text-xs text-[var(--danger)]">{error}</div> : null}
    </div>
  );
}
