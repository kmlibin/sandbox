import { Fragment } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";
import AddCell from "./add-cell";

import CellListItem from "./cell-list-item";

import './cell-list.css'

const CellList: React.FC = () => {
  //selector. comes from our reducers
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    //get all of our cells in an ordered list. we return each id from the order array, then we can look up data in the appropriate order
    return order.map((id) => {
      return data[id];
    });
  });
  console.log(cells);
  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell prevCellId={cell.id} /> 
    </Fragment>
  ));

  return (
    <div className="cell-list">
      {/* //forcevisible so that add cell appears opacity: 1 when there are no renderedcells */}
      <AddCell forceVisible={cells.length === 0} prevCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
