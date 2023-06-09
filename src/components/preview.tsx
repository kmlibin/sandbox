import { useRef, useEffect } from "react";

import "./preview.css";

interface PreviewProps {
  bundleStatus: string;
  code: string;
}

//taking output of bundling process and putting in a script element
//create iframe, listen for events coming from the parent,
//watch for event saying new code has been created, whenever new code has been bundled,
//we recieve in iframe, then we execute it. won't have an issue of unescaped script tags
const html = `
   <html>
    <head> 
    <style>html { background-color: white; }</style></head>
    <body>
      <div id="root"></div>
    <script>
    const handleError = (err) => {
      const root = document.querySelector('#root');
      root.innerHTML = '<div style="color:red;"><h4>Runtime Error</h4>' + err + '</div>'
      throw err;
    };
      window.addEventListener('error', (event) => {
        event.preventDefault();
      handleError(event.error);
    });
      window.addEventListener('message', (event) => {
        try {
      eval(event.data);
        } catch(err) {
         handleError(err)
        }
      }, false);
    </script>
    </body>
   </html>
    `;

const Preview: React.FC<PreviewProps> = ({ code, bundleStatus }) => {
  const iframe = useRef<any>();

  //any time we get new code, look at the iframe, update the srcdoc prop and reset the html
  useEffect(() => {
    //if you assign a srcdoc prop, it automatically resets the iframe and its contents
    iframe.current.srcDoc = html;
    //setTimeOut is to give the browser time to update the srcdoc and set up an eventlistener to watch for our postmessage attempt
    //* arg means post to any domain
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundleStatus && <div className="preview-error">{bundleStatus}</div>}
    </div>
  );
};

export default Preview;
