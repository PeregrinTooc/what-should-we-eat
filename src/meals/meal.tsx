import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Button, Modal, Content, Media, Image } from "react-bulma-components";
export interface Meal {
  renderName(): any;
  renderAsListItem(): any;
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
  constructor(properties) {
    this.mealName = properties.mealName ? properties.mealName : "";
    this.effort = properties.effort ? properties.effort : "";
    this.tags = properties.tags ? [...properties.tags] : "";
    this.healthLevel = properties.healthLevel ? properties.healthLevel : "";
  }
  renderName() {
    return <MealNameComponent props={this.mealName} />;
  }
  renderAsListItem() {
    return <MealListItemComponent key={this.mealName} props={this.mealName} />;
  }
  renderAsModal() {
    return <MealModal props={this}></MealModal>;
  }
}

function MealNameComponent({ props }) {
  return <p>{props}</p>;
}
function MealModal({ props }) {
  const [openModal, setOpenModal] = useState("");

  return (
    <>
      <div className="buttons has-addons">
        <button
          className="button"
          onClick={() => {
            return setOpenModal("card");
          }}
        >
          {props.mealName}
        </button>
        <button className="button is-danger is-outlined">
          <span className="icon is-small">
            <i className="fas fa-times"></i>
          </span>
        </button>
      </div>
      <Modal
        show={openModal === "card"}
        onClose={() => {
          return setOpenModal("");
        }}
      >
        <Modal.Card>
          <Modal.Card.Header showClose>
            <Modal.Card.Title>{props.mealDisplayName}</Modal.Card.Title>
          </Modal.Card.Header>
          <Modal.Card.Body>
            <Media>
              <Media.Item renderAs="figure" align="left">
                <Image
                  size={64}
                  alt="64x64"
                  src="http://bulma.io/images/placeholders/128x128.png"
                />
              </Media.Item>
              <Media.Item>
                <Content>
                  <p>
                    <strong>John Smith</strong> <small>@johnsmith</small>{" "}
                    <small>31m</small>
                    <br />
                    If the children of the Modal is a card, the close button
                    will be on the Card Head instead than the top-right corner
                    You can also pass showClose = false to Card.Head to hide the
                    close button
                  </p>
                </Content>
              </Media.Item>
            </Media>
          </Modal.Card.Body>
          <Modal.Card.Footer renderAs={Button.Group} align="right" hasAddons>
            <Button color="success">Like</Button>
            <Button>Share</Button>
          </Modal.Card.Footer>
        </Modal.Card>
      </Modal>
    </>
  );
}

function MealListItemComponent({ props }) {
  return <MealNameComponent props={props}></MealNameComponent>;
}
