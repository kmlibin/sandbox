import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
    //selector to get cumulative code
    return useTypedSelector((state) => {
        //get data and order
        //iterate over different cells, return a list of strings (which is the code for current and prev cells)
        const { data, order } = state.cells;
        //map over order and return a list of all the diff cells (by id) that we have
        const orderedCells = order.map((id) => data[id]);
    
        //create a working show func and a non-working show func...previously, what you type in any code cell will 
        //appear in subsequent preview cells. this way, we push the correct show function to the right cell
        //rename imports to avoid naming collision, update esbuild configuration
         
        const showFunc = `
        import _React from 'react';
        import _ReactDOM from 'react-dom';
    
        var show = (value) => {
          const root = document.querySelector('#root')
          if(typeof value === 'object') {
            if (value.$$typeof && value.props) {
              _ReactDOM.render(value, root)
            } else {
              root.innerHTML = JSON.stringify(value);
            }  
          } else {
          root.innerHTML = value;
        }
      };
      `;
        const showFuncNoop = "var show = () => {}";
        const cumulativeCode = [
         
        ];
        for (let c of orderedCells) {
          if (c.type === "code") {
            if (c.id === cellId) {
              cumulativeCode.push(showFunc);
            } else {
              cumulativeCode.push(showFuncNoop);
            }
            cumulativeCode.push(c.content);
          }
          if (c.id === cellId) {
            break;
          }
        }
        return cumulativeCode;
      }).join('\n')
}