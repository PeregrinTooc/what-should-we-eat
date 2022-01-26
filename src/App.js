import { Button, List } from './AppElements'
import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';

function Table() {

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const init = require('./meals/index.js').init
      const filePath = '/src/meals/resources/meals.json'
      const baseURI = 'https://api.github.com/repos/PeregrinTooc/what-should-we-eat/contents'
      const mealsData = await init(baseURI, filePath)
      setData(mealsData.getAllMeals())
    }
    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'mealName', // accessor is the "key" in the data
      },
      {
        Header: 'Aufwand',
        accessor: 'effort',
      },
      {
        Header: 'Kategorien',
        accessor: 'tags',
      },
    ],
    []
  )
  const tableInstance = useTable({ columns, data })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance


  return (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: 'solid 3px blue',
                  background: 'aliceblue',
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'white',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function App() {
  return (
    <div>
      <Table />
    </div>
  );
}

export default App;
