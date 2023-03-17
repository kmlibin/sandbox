import ReactDOM from "react-dom";
import React, { useState, useEffect, useRef } from "react";

//components
import CodeEditor from "./components/code-editor";

//libraries
import * as esbuild from "esbuild-wasm";

//plugins
import { unpkgPathPlugin } from "./plugins/unpkg_path_plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const [input, setInput] = useState("");
  const ref = useRef<any>();
  const iframe = useRef<any>();

  //init esbuild
  const startService = async () => {
    //need to make this variable accessible to entire component. useRef, can use it to keep track of any JS code
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });

    //"ref.current" - you get an object back with build, serve, stop, transform. transform (used in onClick) does the transpiling
  };

  //on load of page
  useEffect(() => {
    startService();
  }, []);

  const env = ["process", "env", "NODE_ENV"].join(".");

  //the bundle step. the transpile func is async, so make sure this is async
  const onClick = async () => {
    //only build if you have initialized the service
    if (!ref.current) {
      return;
    }

    //if you assign a srcdoc prop, it automatically resets the iframe and its contents
    iframe.current.srcDoc = html;

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        [env]: '"production"',
        globalName: "window",
      },
    });

    //* arg means post to any domain
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  //taking output of bundling process and putting in a script element
  //create iframe, listen for events coming from the parent,
  //watch for event saying new code has been created, whenever new code has been bundled,
  //we recieve in iframe, then we execute it. won't have an issue of unescaped script tags
  const html = `
   <html>
    <head> </head>
    <body>
      <div id="root"></div>
    <script>
      window.addEventListener('message', (event) => {
        try {
      eval(event.data);
        } catch(err) {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color:red;"><h4>Runtime Error</h4>' + err + '</div>'
          throw err;
        }
      }, false);
    </script>
    </body>
   </html>
    `;

  return (
    <div>
      <CodeEditor initialValue="chello" onChange={(value) => setInput(value)} />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        {/* want to run esbuild once this is clicked */}
        <button onClick={onClick}>Submit</button>
      </div>

      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
