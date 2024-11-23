import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { base64ToFile } from "@/utils";
import { CreateThreadType } from "../../features/shared/api/create-thread";

const toolbarOptions = [
  [{ header: "1" }, { header: "2" }, { font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }],
  ["link", "image"],
  [{ align: [] }],
  ["clean"],
];

export const modules = {
  toolbar: toolbarOptions,
};

interface TextEditorProp {
  handleChange: (data: Partial<CreateThreadType>) => void;
  placeholder?: string;
}

export const TextEditor = ({ handleChange, placeholder }: TextEditorProp) => {
  const [value, setValue] = useState("");
  const [contentData, setContentData] = useState<Partial<CreateThreadType>>(
    {} as Partial<CreateThreadType>,
  );

  useEffect(() => {
    const parseHtml = () => {
      const div = document.createElement("div");
      div.innerHTML = value;
      const image = div.querySelector("img");
      setContentData((prevData) => ({ ...prevData, content: value }));

      if (!image) return;

      const file = base64ToFile(image.src, "image.png");
      setContentData((prevData) => ({ ...prevData, attachment: file }));
    };

    parseHtml();
  }, [value]);

  useEffect(() => {
    handleChange(contentData);
  }, [contentData]);

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      modules={modules}
      placeholder={placeholder}
    />
  );
};
