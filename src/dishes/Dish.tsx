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
  isEmpty(): boolean {
    return this.dishName === "";
  }
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
    return <DishNameDisplay dishName={this.dishName} />;
  }
  setProperties({ dishName }) {
    this.dishName = dishName;
  }
}

function DishNameDisplay({ dishName }) {
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

function DishListItemComponentWithDetailsButton({
  dishName,
  showDetailScreen,
}) {
  return (
    <div className="media">
      <div className="media-content">
        <DishNameDisplay dishName={dishName}></DishNameDisplay>
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
  public dishProperties: {
    dishName: string;
    effort: number;
    tags: string[] | any;
    healthLevel: number;
  };
  public showDetails: boolean;
  constructor() {
    this.showDetails = false;
  }
  render(): JSX.Element {
    return (
      <DishModal
        key={`${this.dishProperties.dishName}-details`}
        dishFormat={this}
        closeDetailScreen={this.closeDetailScreen.bind(this)}
      ></DishModal>
    );
  }
  setProperties(dishProperties) {
    this.dishProperties = { ...dishProperties };
  }
}

function DishModal({ dishFormat, closeDetailScreen }) {
  const [{ showDetails, dishName }, setState] = useState({
    showDetails: dishFormat.showDetails,
    dishName: dishFormat.dishProperties.dishName,
  });
  const [savedName, setSavedName] = useState(dishName);
  const observer = (o) => {
    if (o.showDetails !== showDetails) {
      setState({ dishName: dishName, showDetails: o.showDetails });
    }
  };
  useSubscriber(dishFormat, observer);

  const buttonTexts = ["ändern", "speichern"];
  const displayMode = 0;
  const changeMode = 1;
  const [{ changeButtonText, mode }, setChangeButtonText] = useState({
    changeButtonText: buttonTexts[displayMode],
    mode: displayMode,
  });

  const onChangeClick = () => {
    const newMode = (mode + 1) % 2;
    setSavedName(dishName);
    setChangeButtonText({
      changeButtonText: buttonTexts[newMode],
      mode: newMode,
    });
  };
  return (
    <>
      <Modal
        show={showDetails}
        onClose={() => {
          setChangeButtonText({
            changeButtonText: buttonTexts[0],
            mode: 0,
          });
          if (mode === changeMode) {
            setState({
              showDetails: false,
              dishName: savedName,
            });
          } else {
            closeDetailScreen();
          }
        }}
      >
        <Modal.Card>
          <Modal.Card.Header>
            <div className="media">
              <div className="media-left">
                <div className="content">
                  {mode === displayMode ? (
                    <DishNameDisplay dishName={dishName}></DishNameDisplay>
                  ) : (
                    <DishNameChangeableComponent
                      dishName={dishName}
                      setState={setState}
                      showDetails={showDetails}
                    />
                  )}
                </div>
              </div>
              <ChangeButton
                onChangeClick={onChangeClick}
                changeButtonText={changeButtonText}
              />
            </div>
          </Modal.Card.Header>
          <Modal.Card.Body>
            <DishDetails dishFormat={dishFormat} />
          </Modal.Card.Body>
        </Modal.Card>
      </Modal>
    </>
  );
}

function DishDetails({ dishFormat }) {
  return (
    <div className="media">
      <div className="media-left">
        <div className="content">
          <p>Aufwand: {dishFormat.dishProperties.effort}/10</p>
          <p>Gesundheitslevel: {dishFormat.dishProperties.healthLevel}/10</p>
        </div>
      </div>
      <div className="media-content"></div>
      <div className="media-right">
        <div className="tags are-medium">
          {dishFormat.dishProperties.tags.map((tag) => {
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

function ChangeButton({ onChangeClick, changeButtonText }) {
  return process.env.REACT_APP_USE_CHANGE_FEATURE === "true" ? (
    <div className="media-right">
      <div className="content">
        <div className="mx-1">
          <button className="button" onClick={onChangeClick}>
            {changeButtonText}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

function DishNameChangeableComponent({ dishName, setState, showDetails }) {
  return (
    <input
      className="input"
      type="text"
      value={dishName}
      onChange={(e) => {
        setState({
          showDetails: showDetails,
          dishName: e.target.value,
        });
      }}
    ></input>
  );
}
