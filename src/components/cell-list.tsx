import { useTypedSelector } from "../hooks/use-typed-selector";

import CellListItem from "./cell-list-item";

const CellList: React.FC = () => {
    //comes from our reducers
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    //get all of our cells in an ordered list. we return each id from the order array, then we can look up data in the appropriate order
    return order.map((id) => {
      return data[id];
    });
  });
  console.log(cells)
  const renderedCells = cells.map((cell) => <CellListItem key={cell.id} cell = {cell}/>);
  return <div>{renderedCells}</div>;
};

export default CellList;
