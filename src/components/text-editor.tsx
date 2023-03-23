import React, { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

import "./text-editor.css";

const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("# Header");
  const ref = useRef<HTMLDivElement | null>(null);
  //event listener on body element of document. whenever anyone clicks anywhere on the dom, it will switch

  useEffect(() => {
    //the event target shows the html element you clicked on
    const listener = (event: MouseEvent) => {
      //checking to make sure that user is clicking inside or outside the div
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });

    //cleanup
    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        {/* v|| '' solves TS error of string or undefined */}
        <MDEditor
          value={value}
          onChange={(v) => {
            setValue(v || "");
          }}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
