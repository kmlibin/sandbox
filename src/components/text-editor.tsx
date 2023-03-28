import React, { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useActions } from "../hooks/useActions";

import "./text-editor.css";
import { Cell } from "../state";

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const { updateCell } = useActions();
  const [editing, setEditing] = useState(false);

  //event listener on body element of document. whenever anyone clicks anywhere on the dom, it will switch
  const ref = useRef<HTMLDivElement | null>(null);
  
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
          value={cell.content}
          onChange={(v) => {
            updateCell(cell.id, v || "");
          }}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || 'Click to edit'} />
      </div>
    </div>
  );
};

export default TextEditor;
