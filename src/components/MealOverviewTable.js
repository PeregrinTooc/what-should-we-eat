import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Form, Table } from "react-bulma-components";

function MealsTable(args) {
  const [subject, setSubject] = useState("");
  const { data, mealPlanController, updateMealPlan } = args;
  return (
    <>
      <Table bordered selected="false" size="narrow" striped="true">
        <thead>{getTableHeader()}</thead>
        <tbody>{data.map((row) => getRow(row))}</tbody>
      </Table>
    </>
  );

  function getTableHeader() {
    return (
      <tr>
        <th>
          <abbr title="Name">Name</abbr>
        </th>
        <th>
          <abbr title="Aufwand">Aufwand</abbr>
        </th>
        <th>
          <abbr title="Kategorien">Kategorien</abbr>
        </th>
        <th>
          <abbr title="Geplant für">Geplant für</abbr>
        </th>
      </tr>
    );
  }

  function getRow(meal) {
    return (
      <tr>
        <th>{meal.mealName}</th>
        <td>{meal.effort}</td>
        <td>{meal.tags}</td>
        <td>
          <form>
            <Form.Select
              value={subject}
              onChange={(e) => {
                if (e.target.value !== " ") {
                  mealPlanController.addMealFor(e.target.value, meal);
                  updateMealPlan(mealPlanController.getOverview());
                }
                return setSubject(e.target.value);
              }}
            >
              <option value="nil"> </option>
              <option value="mon">Montag</option>
              <option value="tue">Dienstag</option>
              <option value="wed">Mittwoch</option>
              <option value="thu">Donnerstag</option>
              <option value="fri">Freitag</option>
              <option value="sat">Samstag</option>
              <option value="sun">Sonntag</option>
            </Form.Select>
          </form>
        </td>
      </tr>
    );
  }
}

export default MealsTable;
