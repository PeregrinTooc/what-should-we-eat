import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Modal, Content, Media } from "react-bulma-components";
export interface Meal {
  renderName(): any;
  renderAsListItem(): any;
  renderDetails(): any;
  showDetailScreen(): void;
  closeDetailScreen(): void;
}

export function createMealFromJSON(meal: string): Meal {
  const mealProps = JSON.parse(meal);
  return new MealImpl({ ...mealProps });
}

export function createEmptyMeal(): Meal {
  return new MealImpl({});
}

class MealImpl implements Meal {
  private mealName: string;
  private effort: number;
  private tags: string[] | any;
  private healthLevel: number;
  private showDetails: boolean;
  observer: Function = () => {};
  registerObserver: Function = (observer) => {
    this.observer = observer;
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
    return <MealModal meal={this}></MealModal>;
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
}

function MealNameComponent({ meal }) {
  return <p>{meal.mealName}</p>;
}
function MealModal({ meal }) {
  const [state, setState] = useState(meal);
  state.registerObserver(setState);
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
                <Content>
                  <p>
                    <strong>John Smith</strong> <small>@johnsmith</small>{" "}
                    <small>31m</small>
                    <br />
                    Some Content
                  </p>
                </Content>
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
