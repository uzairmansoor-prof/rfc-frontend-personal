// import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
// import Quill from "quill";

// // Editor is an uncontrolled React component
// interface Props {
//   readOnly: boolean;
//   defaultValue?: any;
//   onTextChange: (param: any) => void;
//   onSelectionChange: (param: any) => void;
// }
// const Editor = forwardRef<any, Props>(
//   ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
//     const containerRef = useRef(null);
//     const defaultValueRef = useRef(defaultValue);
//     const onTextChangeRef = useRef(onTextChange);
//     const onSelectionChangeRef = useRef(onSelectionChange);

//     useLayoutEffect(() => {
//       onTextChangeRef.current = onTextChange;
//       onSelectionChangeRef.current = onSelectionChange;
//     });

//     useEffect(() => {
//       ref.current?.enable(!readOnly);
//     }, [ref, readOnly]);

//     const checkSelectedFormats = () => {
//       if (ref.current) {
//         console.log("qwfe",ref.current.getSelection());
//         const selection = ref.current.getSelection();
//         console.log("nk",{selection});

//         if (selection) {
//           const formats = ref.current.getFormat(
//             selection.index,
//             selection.length,
//           );
//           console.log({ formats }, formats.bold);
//           // setSelectedFormats(formats);
//         }
//       }
//     };

//     useEffect(() => {
//       const container = containerRef.current;
//       const editorContainer = container.appendChild(
//         container.ownerDocument.createElement("div"),
//       );
//       const quill = new Quill(editorContainer, {
//         theme: "snow",
//       });

//       ref.current = quill;

//       if (defaultValueRef.current) {
//         quill.setContents(defaultValueRef.current);
//       }

//       quill.on(Quill.events.TEXT_CHANGE, (...args) => {
//         onTextChangeRef.current?.(...args);
//       });

//       quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
//         onSelectionChangeRef.current?.(...args);
//         checkSelectedFormats();
//       });

//       return () => {
//         quill.off(Quill.events.SELECTION_CHANGE, (...args) => {
//           checkSelectedFormats();
//         });
//                 ref.current = null;

//         container.innerHTML = "";
//       };
//     }, [ref]);

//     return <div ref={containerRef}></div>;
//   },
// );

// Editor.displayName = "Editor";

// export default Editor;
