import { Cell } from "../state";
import ActionBar from "./action-bar";

//components
import CodeCell from "./code-cell";
import TextEditor from "./text-editor";

import "./cell-list-item.css";

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === "code") {
    //allows for the UI to have a thick bar around the action buttons, and rendered above with the code cell. 
    //still rendered "inside" of the text editor
    child = (
      <>
        <div className="action-bar-wrapper">
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <TextEditor cell={cell} />
        <ActionBar id={cell.id} />
      </>
    );
  }
  return <div className="cell-list-item">{child}</div>;
};

export default CellListItem;
