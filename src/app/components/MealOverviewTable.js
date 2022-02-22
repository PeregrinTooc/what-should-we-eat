import React, { useState, useEffect, useCallback } from "react";
import "bulma/css/bulma.min.css";
import { Columns, Form, Table } from "react-bulma-components";

function MealsTable({ mealPlanController, updateMealPlan, mealHandler }) {
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
  const [meals, setMeals] = useState();
  const [tableData, setTableData] = useState([]);
  const [unfilteredData, setUnfilteredData] = useState([]);
  const [options, setOptions] = useState();
  const [filter, setFilter] = useState({ mealName: "", effort: "", tags: "" });

  const applyFilter = useCallback(() => {
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

  useEffect(() => {
    setOptions(calculateOptions(availableDays));
  }, [availableDays]);
  useEffect(() => {
    if (meals) {
      const initialTableData = meals.map((meal) => {
        return { ...meal, plannedForDay: "" };
      });
      setUnfilteredData(initialTableData);
    }
  }, [meals]);
  useEffect(() => {
    if (mealHandler) {
      setMeals(mealHandler.getAllMeals());
    }
  }, [mealHandler]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter, filter, unfilteredData]);
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
      <tr role="row" key={meal.mealName}>
        <td>{meal.mealName}</td>
        <td role="cell">{getEffort()}</td>
        <td role="cell">{getTags()}</td>
        <td role="cell">{getPlannedForDay()}</td>
        <td role="cell">
          <form>{getSelect()}</form>
        </td>
      </tr>
    );

    function getEffort() {
      return (
        <Form.Input
          id={`${meal.mealName}-effortInput`}
          value={getEffortValue()}
          placeholder="Werte zwischen 1 und 10"
          onChange={(e) => {
            const value = e.target.value;
            const NumericValue = Number(value);
            const input = document.getElementById(
              `${meal.mealName}-effortInput`
            );
            if (
              value.length > 0 &&
              (isNaN(NumericValue) || NumericValue > 10 || NumericValue === 0)
            ) {
              input.classList.add("is-danger");
            } else {
              input.classList.remove("is-danger");
              input.classList.add("is-success");
              let updatedMeal = { ...meal };
              updatedMeal.effort = value;
              mealHandler.modifyMeal(updatedMeal);
              setMeals(mealHandler.getAllMeals());
            }
          }}
        ></Form.Input>
      );

      function getEffortValue() {
        if (meal.effort) {
          return meal.effort;
        }
        return "";
      }
    }

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
