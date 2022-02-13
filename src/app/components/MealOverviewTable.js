import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { Form, Table } from "react-bulma-components";

function MealsTable({ availableMeals, mealPlanController, updateMealPlan }) {
  const days = [
    { key: "nil", value: "", pos: 0 },
    { key: "mon", value: "Montag", pos: 1 },
    { key: "tue", value: "Dienstag", pos: 2 },
    { key: "wed", value: "Mittwoch", pos: 3 },
    { key: "thu", value: "Donnerstag", pos: 4 },
    { key: "fri", value: "Freitag", pos: 5 },
    { key: "sat", value: "Samstag", pos: 6 },
    { key: "sun", value: "Sonntag", pos: 7 },
    { key: "del", value: "abwählen", pos: 8 },
  ];
  const [availableDays, setAvailableDays] = useState(days);
  const [tableData, setTableData] = useState([]);
  const [options, setOptions] = useState();
  useEffect(() => {
    setOptions(calculateOptions(availableDays));
  }, [availableDays]);
  useEffect(() => {
    if (availableMeals) {
      setTableData(
        availableMeals.map((meal) => {
          return { ...meal, plannedForDay: "" };
        })
      );
    }
  }, [availableMeals]);
  return (
    <>
      <Table bordered selected={false} size="narrow" striped={true}>
        <thead>{getTableHeader()}</thead>
        <tbody>{tableData.map((row) => getRow(row))}</tbody>
      </Table>
    </>
  );

  function calculateOptions(days) {
    let sortedDays = [...days];
    sortedDays.sort((day1, day2) => {
      return day1.pos - day2.pos;
    });
    return sortedDays.map((day) => {
      return (
        <option
          key={day.key}
          value={day.key}
          unselectable={day.key === "nil" ? "on" : "off"}
        >
          {day.value}
        </option>
      );
    });
  }

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
          <abbr title="Geplant für">geplant für</abbr>
        </th>
        <th>
          <abbr title="Wähle einen Tag">wähle einen Tag</abbr>
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
        <td>{getPlannedForDay()}</td>
        <td>
          <form>{getSelect()}</form>
        </td>
      </tr>
    );

    function getSelect() {
      function onSelectionChange(e) {
        let newDays = [];
        const day = e.target.value;
        if (isNewDaySelected()) {
          if (dayHasAlreadyPlan()) {
            enableDayAgain();
          }
          updatePlanForNewDay();
          removeNewDayFromOptionsAndUpdateTable();
        } else {
          if (dayHasAlreadyPlan()) {
            restoreDayToOptionsAndUpdateTable();
          } else {
            newDays = [...availableDays];
          }
        }
        setAvailableDays(newDays);
        return () => {};

        function restoreDayToOptionsAndUpdateTable() {
          newDays = [...availableDays, restoreDay()];
          meal.plannedForDay = "";
        }

        function removeNewDayFromOptionsAndUpdateTable() {
          availableDays.forEach(({ key, value, pos }) => {
            if (key !== day) {
              newDays.push({ key, value, pos });
            } else {
              meal.plannedForDay = value;
            }
          });
        }

        function updatePlanForNewDay() {
          mealPlanController.addMealFor(day, meal);
          updateMealPlan(mealPlanController.getOverview());
        }

        function enableDayAgain() {
          newDays.push(restoreDay());
        }

        function dayHasAlreadyPlan() {
          return meal.plannedForDay !== "";
        }

        function isNewDaySelected() {
          return day !== "del";
        }

        function restoreDay() {
          let optionKey;
          let pos;
          days.forEach((row) => {
            if (row.value === meal.plannedForDay) {
              optionKey = row.key;
              pos = row.pos;
            }
          });
          return {
            key: optionKey,
            value: meal.plannedForDay,
            pos: pos,
          };
        }
      }
      return (
        <Form.Select
          role={meal.mealName.split(` `).join("_")}
          value=""
          onChange={onSelectionChange}
        >
          {options}
        </Form.Select>
      );
    }

    function getPlannedForDay() {
      if (meal.plannedForDay !== "") {
        return `geplant für ${meal.plannedForDay}`;
      } else {
        return "";
      }
    }
  }
}

export default MealsTable;
