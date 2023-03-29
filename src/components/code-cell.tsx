import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";

//function that bundles
import bundle from "../bundler";

//components
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/useActions";

interface CodeCellProps {
  cell: Cell;
}
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { updateCell } = useActions();
  //the bundle step. the transpile func is async, so make sure this is async

  //wait for 1 ish seconds without any updates to state, if that happens, we wat to run bundling logic. this is
  //called debouncing: we want a piece of code to run as much as possible until a certain amount of time passes, then we run some function
  //so, we are: user types into editor, first time they do we update input state. also set a timer in the code where it bundles user code.
  //if a user then types into the editor sooner than that 1 second, again update, but cancel the previous timer so we don't execute that
  //first bundling logic. repeat this process until 1 second goes by without us cancelling the timer, then the bundling happens

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content);
      setCode(output.code);
      setError(output.err);
    }, 1000);

    //remember, return funcs (cleanup) will run every time useeffect is called. execute logic to cancel previous timer
    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "calc(100% - 10px)", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={code} bundleStatus={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
