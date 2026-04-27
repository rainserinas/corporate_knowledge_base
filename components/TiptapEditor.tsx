"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ImageIcon } from 'lucide-react';

interface TiptapRendererProps {
    content: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('URL of the image:');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    return (
        <div className="flex gap-2 p-2 bg-slate-50 border-b border-slate-200">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500'}`}
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500'}`}
            >
                <List className="h-4 w-4" />
            </button>
        </div>
    );
};

export const TiptapEditor = ({ content, onChange }: { content: string, onChange: (val: string) => void }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate prose-indigo focus:outline-none min-h-[300px] p-6 max-w-none',
            },
        },
    });

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 ring-indigo-50">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export const TiptapRenderer = ({ content }: TiptapRendererProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl border border-slate-200',
                },
            })
        ],
        content: content,
        editable: false,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-slate prose-indigo max-w-none focus:outline-none',
            },
        },
    });

    if (!editor) {
        return <div className="animate-pulse bg-slate-100 h-64 rounded-3xl" />;
    }

    return <EditorContent editor={editor} />;
};