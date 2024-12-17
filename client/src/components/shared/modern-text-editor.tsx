import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import  { createLowlight }  from 'lowlight'
import { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Code, ImageIcon } from 'lucide-react'

interface ModernTextEditorProps {
  initialContent?: string
  handleChange: (data: { content: string; attachment?: File }) => void
  placeholder?: string
}

export const ModernTextEditor = ({
  initialContent,
  handleChange,
  placeholder
}: ModernTextEditorProps) => {
  
  const lowlight = createLowlight();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      handleChange({ content: editor.getHTML() })
    },
  })

  useEffect(() => {
    if (editor && initialContent !== undefined) {
      editor.commands.setContent(initialContent)
    }
  }, [editor, initialContent])

  const addImage = useCallback(async () => {
    // Prompt the user to choose between URL or file
    const choice = window.confirm("Do you want to add an image via URL? Click 'OK' for URL, 'Cancel' for File Upload.");
  
    if (choice) {
      // Add image via URL
      const url = window.prompt('Enter the image URL:');
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } else {
      // Add image via file upload
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
  
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (file && editor) {
          // Convert the file to a base64 URL
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            editor.chain().focus().setImage({ src: base64 }).run();
          };
          reader.readAsDataURL(file);
        }
      };
  
      input.click();
    }
  }, [editor]);
  

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 p-2 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          type="button" 
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          type="button" 
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          type="button" 
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          type="button" 
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
          type="button" 
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={addImage} type="button" >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[200px]" 
        placeholder={placeholder} 
      />
    </div>
  )
}
