import React, { useState } from "react";
import { Modal } from "react-bulma-components";
import {
  useSubscriber,
  Publisher,
  defaultPublisher,
} from "../utils/useSubscriber.ts";

export interface MealFormat {
  render(): JSX.Element;
  setProperties(mealProperties: Object);
}

export interface Meal {
  isEmpty(): boolean;
  export(formatter: MealFormat): void;
}

class MealImpl implements Meal, Publisher {
  mealName: string;
  effort: number;
  tags: string[] | any;
  healthLevel: number;
  constructor(properties) {
    this.mealName = properties.mealName ? properties.mealName : "";
    this.effort = properties.effort ? properties.effort : "";
    this.tags = properties.tags ? [...properties.tags] : "";
    this.healthLevel = properties.healthLevel ? properties.healthLevel : "";
  }
  export(formatter: MealFormat): void {
    formatter.setProperties({ ...this });
  }
  isEmpty = () => {
    return this.mealName === "";
  };
}

const emptyMeal = new MealImpl({});

export function createMealWithProperties(mealProps: Object): Meal {
  return new MealImpl({ ...mealProps });
}

export function createEmptyMeal(): Meal {
  return emptyMeal;
}

export class MealNameFormat implements MealFormat {
  public mealName: string;
  render(): JSX.Element {
    return <MealNameComponent mealName={this.mealName} />;
  }
  setProperties({ mealName }) {
    this.mealName = mealName;
  }
}

function MealNameComponent({ mealName }) {
  return <p>{mealName}</p>;
}
export class MealListItemFormat implements MealFormat {
  private meal: Meal;
  public mealName: string;
  constructor(meal) {
    this.meal = meal;
  }
  render(): JSX.Element {
    const modalFormat = new MealModalFormat();
    this.meal.export(modalFormat);
    return (
      <>
        {modalFormat.render()}
        <MealListItemComponentWithDetailsButton
          key={this.mealName}
          mealName={this.mealName}
          showDetailScreen={modalFormat.showDetailScreen.bind(modalFormat)}
        />
      </>
    );
  }
  setProperties(meal) {
    this.mealName = meal.mealName;
  }
}

export class MealModalFormat implements MealFormat, Publisher {
  observers: Function[] = [];
  subscribe = defaultPublisher.subscribe.bind(this);
  unsubscribe = defaultPublisher.unsubscribe.bind(this);
  publish = defaultPublisher.publish.bind(this);
  showDetailScreen() {
    this.showDetails = true;
    this.publish();
  }

  closeDetailScreen() {
    this.showDetails = false;
    this.publish();
  }
  public mealName: string;
  public effort: number;
  public tags: string[] | any;
  public healthLevel: number;
  private showDetails: boolean;
  constructor() {
    this.showDetails = false;
  }
  render(): JSX.Element {
    return (
      <MealModal
        key={`${this.mealName}-details`}
        mealFormat={this}
        closeDetailScreen={this.closeDetailScreen.bind(this)}
      ></MealModal>
    );
  }
  setProperties({ mealName, effort, tags, healthLevel }) {
    this.mealName = mealName;
    this.effort = effort;
    this.tags = tags;
    this.healthLevel = healthLevel;
  }
}

function MealModal({ mealFormat, closeDetailScreen }) {
  const [{ showDetails }, setState] = useState({
    showDetails: mealFormat.showDetails,
  });
  const observer = (o) => {
    if (o.showDetails !== showDetails) {
      setState({ ...o });
    }
  };
  useSubscriber(mealFormat, observer);
  return (
    <>
      <Modal show={showDetails} onClose={closeDetailScreen}>
        <Modal.Card>
          <Modal.Card.Header showClose>
            <Modal.Card.Title>{mealFormat.mealName}</Modal.Card.Title>
          </Modal.Card.Header>
          <Modal.Card.Body>
            <MealDetails mealFormat={mealFormat} />
          </Modal.Card.Body>
        </Modal.Card>
      </Modal>
    </>
  );
}

function MealListItemComponentWithDetailsButton({
  mealName,
  showDetailScreen,
}) {
  return (
    <div className="media">
      <div className="media-content">
        <MealNameComponent mealName={mealName}></MealNameComponent>
      </div>
      <div className="media-right">
        <button
          className="button"
          onClick={() => {
            showDetailScreen();
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
}

function MealDetails({ mealFormat }) {
  return (
    <div className="media">
      <div className="media-left">
        <div className="content">
          <p>Aufwand: {mealFormat.effort}/10</p>
          <p>Gesundheitslevel: {mealFormat.healthLevel}/10</p>
        </div>
      </div>
      <div className="media-content"></div>
      <div className="media-right">
        <div className="tags are-medium">
          {mealFormat.tags.map((tag) => {
            return (
              <div className="tag" key={tag}>
                {tag}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
