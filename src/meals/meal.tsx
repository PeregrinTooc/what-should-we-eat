import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { Modal, Content, Media } from "react-bulma-components";
export interface Meal {
  renderName(): any;
  renderAsListItemWithDetailsButton(): any;
  renderDetails(): any;
  showDetailScreen(): void;
  closeDetailScreen(): void;
  isEmpty(): boolean;
}

class MealImpl implements Meal {
  private mealName: string;
  private effort: number;
  private tags: string[] | any;
  private healthLevel: number;
  private showDetails: boolean;
  private _isEmpty: boolean;
  observer: Function = () => {};
  subscribe: Function = (observer) => {
    this.observer = observer;
  };
  unsubscribe: Function = (observer) => {
    this.observer = () => {};
  };
  constructor(properties) {
    this.mealName = properties.mealName ? properties.mealName : "";
    this.effort = properties.effort ? properties.effort : "";
    this.tags = properties.tags ? [...properties.tags] : "";
    this.healthLevel = properties.healthLevel ? properties.healthLevel : "";
    this.showDetails = false;
  }
  renderName() {
    return <MealNameComponent meal={this} />;
  }
  renderAsListItemWithDetailsButton() {
    return (
      <>
        {this.renderDetails()}
        <MealListItemComponent key={this.mealName} meal={this} />
      </>
    );
  }
  renderDetails() {
    return <MealModal key={`${this.mealName}-details`} meal={this}></MealModal>;
  }
  showDetailScreen = () => {
    this.showDetails = true;
    this.observer({ ...this });
  };
  // use the inline function syntax so the methods are copied by the spread operator
  // and the method can be passed as a handler
  closeDetailScreen = () => {
    this.showDetails = false;
    this.observer({ ...this });
  };
  isEmpty = () => {
    return this.mealName === "";
  };
}

const emptyMeal = new MealImpl({});

export function createMealFromJSON(meal: string): Meal {
  const mealProps = JSON.parse(meal);
  return new MealImpl({ ...mealProps });
}

export function createEmptyMeal(): Meal {
  return emptyMeal;
}

function MealNameComponent({ meal }) {
  return <p>{meal.mealName}</p>;
}
function MealModal({ meal }) {
  const [state, setState] = useState(meal);
  useEffect(() => {
    state.subscribe(setState);
    return () => {
      state.unsubscribe();
    };
  }, [setState, state]);
  return (
    <>
      <Modal show={state.showDetails} onClose={state.closeDetailScreen}>
        <Modal.Card>
          <Modal.Card.Header showClose>
            <Modal.Card.Title>{state.mealName}</Modal.Card.Title>
          </Modal.Card.Header>
          <Modal.Card.Body>
            <Media>
              <Media.Item>
                <Content></Content>
              </Media.Item>
            </Media>
          </Modal.Card.Body>
        </Modal.Card>
      </Modal>
    </>
  );
}

function MealListItemComponent({ meal }) {
  return (
    <>
      <MealNameComponent meal={meal}></MealNameComponent>
      <button
        className="button"
        onClick={() => {
          meal.showDetailScreen();
        }}
      >
        Details
      </button>
    </>
  );
}
