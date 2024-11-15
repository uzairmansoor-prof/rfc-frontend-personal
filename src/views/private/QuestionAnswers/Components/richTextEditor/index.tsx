import React, { useRef } from "react";
// import "quill/dist/quill.snow.css";
import "./styles.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
interface Props {
  fieldName: string;
  onChange: (event: any) => void;
  defaultValue: string;
}
const RichTextEditor = ({ fieldName, onChange, defaultValue }: Props) => {
  // Use a ref to access the quill instance directly
  const quillRef = useRef<ReactQuill>(null);

  const isUserTyping = useRef(false);

  const handleEditorBlur = () => {
    isUserTyping.current = false;
  };

  const handleEditorFocus = () => {
    isUserTyping.current = true;
  };

  const handleEditorChange = (value, delta, source, editor) => {
    // Only trigger onChange if the user is typing
    if (isUserTyping.current) {
      onChange({
        target: { name: fieldName, value },
      });
    }
  };

  // console.log(typeof defaultValue, defaultValue);

  return (
    <ReactQuill
      onChange={handleEditorChange}
      value={defaultValue}
      ref={quillRef}
      onBlur={handleEditorBlur}
      onFocus={handleEditorFocus}
      placeholder={"Enter Answer"}
      // modules={[""]}
      // modules={{
      //   toolbar: [["bold", "italic"]],
      // }}
      // modules={Editor.modules}
      theme={"snow"} // pass false to use minimal theme
    />
  );
};

export default React.memo(RichTextEditor);
