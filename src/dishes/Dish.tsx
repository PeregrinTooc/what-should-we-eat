import React, { useState } from "react";
import { Modal } from "react-bulma-components";
import {
  useSubscriber,
  Publisher,
  defaultPublisher,
} from "../utils/useSubscriber.ts";

export interface DishFormat {
  render(): JSX.Element;
  setProperties(dishProperties: Object);
}

export interface Dish {
  isEmpty(): boolean;
  export(formatter: DishFormat): void;
}

class DishImpl implements Dish, Publisher {
  dishName: string;
  effort: number;
  tags: string[] | any;
  healthLevel: number;
  constructor(properties) {
    this.dishName = properties.dishName ? properties.dishName : "";
    this.effort = properties.effort ? properties.effort : "";
    this.tags = properties.tags ? [...properties.tags] : "";
    this.healthLevel = properties.healthLevel ? properties.healthLevel : "";
  }
  export(formatter: DishFormat): void {
    formatter.setProperties({ ...this });
  }
  isEmpty = () => {
    return this.dishName === "";
  };
}

const emptyDish = new DishImpl({});

export function createDishWithProperties(dishProps: Object): Dish {
  return new DishImpl({ ...dishProps });
}

export function createEmptyDish(): Dish {
  return emptyDish;
}

export class DishNameFormat implements DishFormat {
  public dishName: string;
  render(): JSX.Element {
    return <DishNameComponent dishName={this.dishName} />;
  }
  setProperties({ dishName }) {
    this.dishName = dishName;
  }
}

function DishNameComponent({ dishName }) {
  return <p>{dishName}</p>;
}
export class DishListItemFormat implements DishFormat {
  private dish: Dish;
  public dishName: string;
  constructor(dish) {
    this.dish = dish;
  }
  render(): JSX.Element {
    const modalFormat = new DishModalFormat();
    this.dish.export(modalFormat);
    return (
      <>
        {modalFormat.render()}
        <DishListItemComponentWithDetailsButton
          key={this.dishName}
          dishName={this.dishName}
          showDetailScreen={modalFormat.showDetailScreen.bind(modalFormat)}
        />
      </>
    );
  }
  setProperties(dish) {
    this.dishName = dish.dishName;
  }
}

export class DishModalFormat implements DishFormat, Publisher {
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
  public dishName: string;
  public effort: number;
  public tags: string[] | any;
  public healthLevel: number;
  private showDetails: boolean;
  constructor() {
    this.showDetails = false;
  }
  render(): JSX.Element {
    return (
      <DishModal
        key={`${this.dishName}-details`}
        dishFormat={this}
        closeDetailScreen={this.closeDetailScreen.bind(this)}
      ></DishModal>
    );
  }
  setProperties({ dishName, effort, tags, healthLevel }) {
    this.dishName = dishName;
    this.effort = effort;
    this.tags = tags;
    this.healthLevel = healthLevel;
  }
}

function DishModal({ dishFormat, closeDetailScreen }) {
  const [{ showDetails }, setState] = useState({
    showDetails: dishFormat.showDetails,
  });
  const observer = (o) => {
    if (o.showDetails !== showDetails) {
      setState({ ...o });
    }
  };
  useSubscriber(dishFormat, observer);
  return (
    <>
      <Modal show={showDetails} onClose={closeDetailScreen}>
        <Modal.Card>
          <Modal.Card.Header showClose>
            <Modal.Card.Title>{dishFormat.dishName}</Modal.Card.Title>
          </Modal.Card.Header>
          <Modal.Card.Body>
            <DishDetails dishFormat={dishFormat} />
          </Modal.Card.Body>
        </Modal.Card>
      </Modal>
    </>
  );
}

function DishListItemComponentWithDetailsButton({
  dishName,
  showDetailScreen,
}) {
  return (
    <div className="media">
      <div className="media-content">
        <DishNameComponent dishName={dishName}></DishNameComponent>
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

function DishDetails({ dishFormat }) {
  return (
    <div className="media">
      <div className="media-left">
        <div className="content">
          <p>Aufwand: {dishFormat.effort}/10</p>
          <p>Gesundheitslevel: {dishFormat.healthLevel}/10</p>
        </div>
      </div>
      <div className="media-content"></div>
      <div className="media-right">
        <div className="tags are-medium">
          {dishFormat.tags.map((tag) => {
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
