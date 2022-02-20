import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { Columns, Form, Table } from "react-bulma-components";

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
  const [unfilteredData, setUnfilteredData] = useState([]);
  const [options, setOptions] = useState();
  const [filter, setFilter] = useState({ mealName: "", effort: "", tags: "" });
  useEffect(() => {
    setOptions(calculateOptions(availableDays));
  }, [availableDays]);
  useEffect(() => {
    if (availableMeals) {
      const initialTableData = availableMeals.map((meal) => {
        return { ...meal, plannedForDay: "" };
      });
      setTableData(initialTableData);
      setUnfilteredData(initialTableData);
    }
  }, [availableMeals]);
  useEffect(() => {
    setTableData(
      [...unfilteredData].filter((meal) => {
        return (
          (meal.mealName
            .toLowerCase()
            .includes(filter.mealName.toLowerCase()) &&
            meal.tags.filter((tag) => {
              return tag.toLowerCase().startsWith(filter.tags.toLowerCase());
            }).length > 0) ||
          meal.tags.length === 0
        );
      })
    );
  }, [filter, unfilteredData]);

  return (
    <>
      {getFilterBar()}
      {getMealsTable()}
    </>
  );

  function getMealsTable() {
    return (
      <Table bordered selected={false} size="narrow" striped={true}>
        <thead>{getTableHeader()}</thead>
        <tbody>{tableData.map((row) => getRow(row))}</tbody>
      </Table>
    );
  }

  function getFilterBar() {
    return (
      <Columns centered={true}>
        {getNameFilter()}
        {getEffortFilter()}
        {getTagFilter()}
        {getHealthLevelFilter()}
      </Columns>
    );

    function getHealthLevelFilter() {
      return (
        <Columns.Column size={"one-quarter"}>
          <Form.Field>
            <Form.Label htmlFor="HealthLevelFilter">
              {`Gesundheitslevel`}{" "}
            </Form.Label>
            <Form.Input id="HealthLevelFilter"></Form.Input>
          </Form.Field>
        </Columns.Column>
      );
    }

    function getTagFilter() {
      return (
        <Columns.Column size={"one-quarter"}>
          <Form.Field>
            <Form.Label htmlFor="TagFilter">{`Kategorien`} </Form.Label>
            <Form.Input
              id="TagFilter"
              onChange={(e) => {
                const value = e.target.value;
                let newFilter = { ...filter };
                newFilter.tags = value;
                setFilter(newFilter);
              }}
            ></Form.Input>
          </Form.Field>
        </Columns.Column>
      );
    }

    function getEffortFilter() {
      return (
        <Columns.Column size={"one-quarter"}>
          <Form.Field>
            <Form.Label htmlFor="EffortFilter">{`Aufwand`} </Form.Label>
            <Form.Input id="EffortFilter"></Form.Input>
          </Form.Field>
        </Columns.Column>
      );
    }

    function getNameFilter() {
      return (
        <Columns.Column size={"one-quarter"}>
          <Form.Field>
            <Form.Label htmlFor="NameFilter">{`Name`}</Form.Label>
            <Form.Input
              id="NameFilter"
              onChange={(e) => {
                const value = e.target.value;
                let newFilter = { ...filter };
                newFilter.mealName = value;
                setFilter(newFilter);
              }}
            ></Form.Input>
          </Form.Field>
        </Columns.Column>
      );
    }
  }

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
        <td>{getTags()}</td>
        <td>{getPlannedForDay()}</td>
        <td>
          <form>{getSelect()}</form>
        </td>
      </tr>
    );

    function getTags() {
      if (meal.tags.length > 0) {
        return meal.tags[0];
      }
      return "";
    }

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
