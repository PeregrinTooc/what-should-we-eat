import { render, screen, act, waitForElementToBeRemoved, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mondayDish, mondayDishName } from "./resources/testDishes";
import { createDishFilterObject } from "./DishNameFilter";
import { DishNameFormat, DishListItemFormat, DishModalFormat, createDishWithProperties } from './Dish';

describe("tests for dish rendering", () => {
  let user;
  beforeEach(() => user = userEvent.setup());
  it("should render as a modal", async () => {
    const format = new DishModalFormat()
    mondayDish.export(format)
    render(format.render());
    expect(screen.queryByText(mondayDishName)).not.toBeInTheDocument();
    act(() => format.showDetailScreen());
    expect(screen.getByText(mondayDishName)).toBeInTheDocument();
    expect(screen.getByText("Kartoffeln")).toBeInTheDocument();
    expect(screen.getByText("Ofen")).toBeInTheDocument();
    expect(screen.getByText("Aufwand: 3/10")).toBeInTheDocument();
    expect(screen.getByText("Gesundheitslevel: 7/10")).toBeInTheDocument();
    const closeButton = screen.getByLabelText("close");
    await act(async () => { await user.click(closeButton) });
    expect(screen.queryByText(mondayDishName)).not.toBeInTheDocument();
  });

  it("should render as a list item with a details button which opens the modal", async () => {
    const format = new DishListItemFormat(mondayDish)
    mondayDish.export(format)
    render(format.render());
    expect(screen.getByText(mondayDishName)).toBeInTheDocument();
    const detailsButton = screen.getByRole("button");
    expect(detailsButton).toHaveTextContent("Details");
    expect(screen.queryByLabelText("close")).not.toBeInTheDocument();
    await act(async () => { await user.click(detailsButton) });
    expect(screen.getByLabelText("close")).toBeInTheDocument();
  });
  it("should render its name", async () => {
    const format = new DishNameFormat();
    mondayDish.export(format)
    render(format.render())
    expect(screen.getByText(mondayDishName)).toBeInTheDocument();
  });
});


if (process.env.REACT_APP_USE_CHANGE_FEATURE === "true") {

  describe('tests for changes to dishes', () => {

    const format = new DishModalFormat()
    let user;
    beforeEach(() => {
      mondayDish.export(format)
      user = userEvent.setup();
    })
    it('should render a "change"-button on the detail screen', async () => {
      render(format.render());
      act(() => format.showDetailScreen());
      const changeButton = screen.getByRole("button", { name: 'ändern' });
      expect(changeButton).toBeInTheDocument()
    });

    it("should change the 'change'-button's text to 'save' and vice versa on press", async () => {
      render(format.render());
      act(() => format.showDetailScreen());
      const changeButton = screen.getByRole("button", { name: 'ändern' });
      await act(async () => { await user.click(changeButton) })
      expect(changeButton.textContent).toBe('speichern')
      await act(async () => { await user.click(changeButton) })
      expect(changeButton.textContent).toBe('ändern')
    });

    it("should transform the details screen to an input form on press and save changed on next press but discard them on close", async () => {
      const newName = 'SomeName';
      render(format.render());
      act(() => format.showDetailScreen());
      let changeButton = screen.getByRole("button", { name: 'ändern' });
      let closeButton = screen.getByRole("button", { name: '' });
      await act(async () => { await user.click(changeButton) });
      let nameInputs = screen.getAllByRole("textbox")
      let nameInput = nameInputs.filter((input) => { return input["value"] === mondayDishName })[0]
      await act(async () => { await user.clear(nameInput) });
      await act(async () => { await user.type(nameInput, newName) });
      expect(nameInput).toHaveValue(newName)
      await act(async () => { await user.click(changeButton) })
      expect(screen.getByText(newName)).toBeInTheDocument();
      await act(async () => { await user.click(closeButton) })
      act(() => format.showDetailScreen());
      closeButton = screen.getByRole("button", { name: '' });
      changeButton = screen.getByRole("button", { name: 'ändern' });
      expect(screen.getByText(newName)).toBeInTheDocument();
      await act(async () => { await user.click(changeButton) })
      nameInputs = screen.getAllByRole("textbox")
      nameInput = nameInputs.filter((input) => { return input["value"] === newName })[0]
      await act(async () => { await user.clear(nameInput) });
      await act(async () => { await user.type(nameInput, mondayDishName) })
      expect(nameInput).toHaveValue(mondayDishName)
      await act(async () => { await user.click(closeButton) })
      act(() => format.showDetailScreen());
      closeButton = screen.getByRole("button", { name: '' });
      changeButton = screen.getByRole("button", { name: 'ändern' });
      expect(screen.queryByText(mondayDishName)).not.toBeInTheDocument();
    });
  });
}

describe("tests for dish filtering", () => {
  let filterObject;
  let user;
  beforeEach(() => {
    filterObject = createDishFilterObject();
    user = userEvent.setup();
  });

  it.each([
    [mondayDishName, true],
    ["Gemüse", true],
    ["gemüse", true],
    ["", true],
    ["asdfgbssdfg", false],
  ])(
    "filters for name case-insensitive and matches empty strings",
    (input, expected) => {
      filterObject.addFilterForName().toMatchContain(input);
      expect(filterObject.matches(mondayDish)).toEqual(expected);
    }
  );

  it("should render the filter bar", async () => {

    filterObject.addFilterForName().toMatchContain("");
    render(filterObject.render());
    expect(screen.getByText("Name")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
    await act(async () => { await user.type(input, "Ofen") });
    expect(input).toHaveValue("Ofen")
    await act(async () => { await user.clear(input) });
    expect(input).toHaveValue("");
    await act(async () => { await user.type(input, "asdf") });
    expect(filterObject.matches(mondayDish)).toEqual(false);
    expect(filterObject.matches(createDishWithProperties({ dishName: "asdf" }))).toEqual(true);
  });

  it("should inform subscribers about changes", () => {
    let hasInformed = false;
    filterObject.addFilterForName().toMatchContain("");
    filterObject.subscribe((filterObject) => {
      hasInformed = true;
    });
    filterObject.addFilterForName().toMatchContain("asdd");
    expect(hasInformed).toBe(true);
  });
});
