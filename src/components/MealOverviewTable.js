import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Form, Table } from "react-bulma-components";

function MealsTable({ data, mealPlanController, updateMealPlan }) {
  const [subject, setSubject] = useState("");
  const days = {
    nil: "",
    mon: "Montag",
    tue: "Dienstag",
    wed: "Mittwoch",
    thu: "Donnerstag",
    fri: "Freitag",
    sat: "Samstag",
    sun: "Sonntag",
  };
  const optionTags = Object.keys(days).map((key) => {
    return (
      <option key={key} value={key}>
        {days[key]}
      </option>
    );
  });

  return (
    <>
      <Table bordered selected={false} size="narrow" striped={true}>
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
      <tr key={meal.mealName}>
        <td>{meal.mealName}</td>
        <td>{meal.effort}</td>
        <td>{meal.tags}</td>
        <td>
          <form>
            <Form.Select
              data-testid="plannedFor"
              value={subject}
              onChange={(e) => {
                if (e.target.value !== " ") {
                  mealPlanController.addMealFor(e.target.value, meal);
                  updateMealPlan(mealPlanController.getOverview());
                }
                return setSubject(e.target.value);
              }}
            >
              {optionTags}
            </Form.Select>
          </form>
        </td>
      </tr>
    );
  }
}

export default MealsTable;
