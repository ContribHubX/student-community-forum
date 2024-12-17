import { useState, useEffect } from "react";
import { ModernTextEditor } from "./modern-text-editor";
import { CreateThreadType } from "../../features/shared/api/create-thread";
import { base64ToFile } from "@/utils";

interface TextEditorProp {
  initialContent?: string;
  handleChange: (data: Partial<CreateThreadType>) => void;
  placeholder?: string;
}

export const NewTextEditor = ({
  initialContent,
  handleChange,
  placeholder,
}: TextEditorProp) => {
  const [value, setValue] = useState(initialContent || "");
  const [contentData, setContentData] = useState<Partial<CreateThreadType>>(
    {} as Partial<CreateThreadType>
  );

  useEffect(() => {
    if (initialContent && initialContent !== value) {
      setValue(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    const parseHtml = () => {
      const div = document.createElement("div");
      div.innerHTML = value;

      const image = div.querySelector("img");
      setContentData((prevData) => ({ ...prevData, content: value }));

      if (image) {
        const base64 = image.src;

        const isBase64 = base64.startsWith("data:image/") && base64.includes("base64,");

        if (isBase64) {
            const file = base64ToFile(base64, "image.png");
            setContentData((prevData) => ({ ...prevData, attachment: file }));
        } else {
            setContentData((prevData) => ({ ...prevData, attachment: base64 }));
        }
      }
    };

    parseHtml();
  }, [value]);

  useEffect(() => {
    handleChange(contentData);
  }, [contentData, handleChange]);

  const handleEditorChange = ({
    content,
    attachment,
  }: {
    content: string;
    attachment?: File;
  }) => {
    setValue(content);
    setContentData((prevData) => ({
      ...prevData,
      content,
      attachment,
    }));
  };

  return (
    <ModernTextEditor
      initialContent={initialContent}
      handleChange={handleEditorChange}
      placeholder={placeholder}
    />
  );
};

