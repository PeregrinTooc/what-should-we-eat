import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Modal } from "react-bulma-components";
import { useSubscriber, Publisher, defaultPublisher } from "./useSubscriber.ts";
export interface Meal {
  renderName(): any;
  renderAsListItemWithDetailsButton(): any;
  renderDetails(): any;
  showDetailScreen(): void;
  closeDetailScreen(): void;
  isEmpty(): boolean;
}

class MealImpl implements Meal, Publisher {
  private mealName: string;
  private effort: number;
  private tags: string[] | any;
  private healthLevel: number;
  private showDetails: boolean;
  private _isEmpty: boolean;
  observers: Function[] = [];
  subscribe = defaultPublisher.subscribe.bind(this);
  unsubscribe = defaultPublisher.unsubscribe.bind(this);
  publish = defaultPublisher.publish.bind(this);
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
    this.publish();
  };
  // use the inline function syntax so the methods are copied by the spread operator
  // and the method can be passed as a handler
  closeDetailScreen = () => {
    this.showDetails = false;
    this.publish();
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
  const [state, setState] = useState({ ...meal });
  const observer = (o) => {
    if (o.showDetails !== state.showDetails) {
      setState({ ...o })
    }
  }
  useSubscriber(meal, observer)
  return (
    <>
      <Modal show={state.showDetails} onClose={state.closeDetailScreen}>
        <Modal.Card>
          <Modal.Card.Header showClose>
            <Modal.Card.Title>{state.mealName}</Modal.Card.Title>
          </Modal.Card.Header>
          <Modal.Card.Body>
            <div className="media">
              <div className="media-left">
                <div className="content">
                  <p>Aufwand: {state.effort}/10</p>
                  <p>Gesundheitslevel: {state.healthLevel}/10</p>
                </div>
              </div>
              <div className="media-content"></div>
              <div className="media-right">
                <div className="tags are-medium">
                  {state.tags.map((tag) => {
                    return (
                      <div className="tag" key={tag}>
                        {tag}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Modal.Card.Body>
        </Modal.Card>
      </Modal>
    </>
  );
}

function MealListItemComponent({ meal }) {
  return (
    <div className="media">
      <div className="media-content">
        <MealNameComponent meal={meal}></MealNameComponent>
      </div>
      <div className="media-right">
        <button
          className="button"
          onClick={() => {
            meal.showDetailScreen();
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
}
