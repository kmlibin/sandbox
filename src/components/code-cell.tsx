import React, { useEffect } from "react";

//components
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { useCumulativeCode } from "../hooks/use-cumulative-code";

import "./code-cell.css";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id)

  //wait for 1 ish seconds without any updates to state, if that happens, we wat to run bundling logic. this is
  //called debouncing: we want a piece of code to run as much as possible until a certain amount of time passes, then we run some function
  //so, we are: user types into editor, first time they do we update input state. also set a timer in the code where it bundles user code.
  //if a user then types into the editor sooner than that 1 second, again update, but cancel the previous timer so we don't execute that
  //first bundling logic. repeat this process until 1 second goes by without us cancelling the timer, then the bundling happens

  useEffect(() => {
    //this is essentially so that first load doesn't take 1 s, and it loads immediately
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }
    //this is the debounce logic
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 1000);

    //remember, return funcs (cleanup) will run every time useeffect is called. execute logic to cancel previous timer
    return () => {
      clearTimeout(timer);
    }; //createBundle...only add if declared inside of func or recieved as prop
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} bundleStatus={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
