//ctrl click to see the different types it exports - that is where we find the resizableboxprops types. when providing width directly, max/min constraints
//are no longer respected in resizablebox
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import { useEffect, useState } from "react";
import "./resizable.css";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  //width between resizable and resizablebox is jumping, need to synchronize these state changes.
  const [width, setWidth] = useState(window.innerWidth * 0.75);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  let resizableProps: ResizableBoxProps;

  //use inner height and width to update our resizable box component. update state, which forces rerender
  useEffect(() => {
    //goal is allow user to type into code editor, if they stop typing for a second, auto take 
    //that code bundle and execute it in preview window
    
    //timer/setTimeOut = debouncing
    let timer: any;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    window.addEventListener("resize", listener);

    //cleanup
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [width]);

  if (direction === "horizontal") {
    //props available on resizable box
    resizableProps = {
      className: "resize-horizontal",
      height: Infinity,
      width,
      resizeHandles: ["e"],
      maxConstraints: [innerWidth * 0.75, Infinity],
      minConstraints: [innerWidth * 0.2, Infinity],
      //called whenever user stops dragging
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
      maxConstraints: [Infinity, innerHeight * 0.9],
      minConstraints: [Infinity, 24],
    };
  }

  return (
    //takes all different props we defined and assigns them to ResizableBox
    <ResizableBox {...resizableProps}>{children}</ResizableBox>
  );
};

export default Resizable;
