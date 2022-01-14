import { Button, List } from './AppElements'
import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
const meals = require('./meals/index.js')

function Table() {

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const mealsData = await meals.init('./meals/resources/meals.csv')
      //getAllMeals()
      setData(mealsData)
    }
    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Column 1',
        accessor: 'mealName', // accessor is the "key" in the data
      },
      {
        Header: 'Column 2',
        accessor: 'effort',
      },
      {
        Header: 'Column 3',
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
                  borderBottom: 'solid 3px red',
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
                      background: 'papayawhip',
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
      <Button>'Hello World'</Button>
    </div>
  );
}

export default App;
