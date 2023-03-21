//ctrl click to see the different types it exports - that is where we find the resizableboxprops types
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import { useEffect, useState } from "react";
import "./resizable.css";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  console.log(children);

  let resizableProps: ResizableBoxProps;

  //use inner height and width to update our resizable box component. update state, which forces rerender
  useEffect(() => {
    //timer/setTimeOut = debouncing
    let timer: any;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
      }, 100);
    };
    window.addEventListener("resize", listener);

    //cleanup
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      height: Infinity,
      width: innerWidth * 0.75,
      resizeHandles: ["e"],
      maxConstraints: [innerWidth * 0.75, Infinity],
      minConstraints: [innerWidth * 0.2, Infinity],
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
