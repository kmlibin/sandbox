import { Fragment } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";
import AddCell from "./add-cell";

import CellListItem from "./cell-list-item";

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
      <AddCell nextCellId={cell.id} />
      <CellListItem cell={cell} />
    </Fragment>
  ));

  return (
    <div>
      {renderedCells}
      <AddCell nextCellId={null} />
    </div>
  );
};

export default CellList;
