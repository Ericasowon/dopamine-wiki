"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Quote, ImageIcon, Heading2, Heading3 } from "lucide-react";
import { useRef, useCallback } from "react";

interface WikiEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function WikiEditor({ content, onChange, placeholder }: WikiEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || "내용을 입력하세요..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "prose max-w-none focus:outline-none min-h-[200px] p-3" },
    },
  });

  const uploadImage = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url && editor) {
      editor.chain().focus().setImage({ src: data.url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}`}
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 ${editor.isActive("blockquote") ? "bg-gray-200" : ""}`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadImage(f);
            e.target.value = "";
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
