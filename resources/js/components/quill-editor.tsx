import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // import Quill theme
import { useEffect, useRef } from 'react';

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: 'Write something...',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                ],
            },
        });

        // Set initial value
        if (value) {
            quillRef.current.root.innerHTML = value;
        }

        // On content change
        quillRef.current?.on('text-change', () => {
            if (quillRef.current) {
                onChange(quillRef.current.root.innerHTML);
            }
        });
    }, [onChange, value]);

    return <div ref={editorRef} className="rounded bg-black shadow" />;
}
