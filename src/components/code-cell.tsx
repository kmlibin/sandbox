import ReactDOM from "react-dom";
import React, { useState } from "react";

//function that bundles
import bundle from "../bundler";

//components
import CodeEditor from "./code-editor";
import Preview from "./preview";


const CodeCell= () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  //the bundle step. the transpile func is async, so make sure this is async
  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor initialValue="chello" onChange={(value) => setInput(value)} />
      <div>
        {/* want to run esbuild once this is clicked */}
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell
