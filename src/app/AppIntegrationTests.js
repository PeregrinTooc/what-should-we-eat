import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { baseURI } from "./App.test";

it("updates form, removes selected option and adds it again after deselection", async () => {
  render(<App baseURI={baseURI} />);
  const mealName = "Ofengemüse mit Kartoffeln und Tzatziki";
  const selectOptionRoleName = mealName.split(` `).join("_");
  await screen.findByText(mealName);
  userEvent.selectOptions(screen.getByRole(selectOptionRoleName), "mon");
  expect(screen.getByLabelText("Essen für Montag")).toHaveDisplayValue(
    mealName
  );
  expect(screen.getByRole(selectOptionRoleName)).toHaveLength(8);
  expect(await screen.findByText("geplant für Montag")).toBeDefined();
  userEvent.selectOptions(screen.getByRole(selectOptionRoleName), "del");
  expect(screen.getByRole(selectOptionRoleName)).toHaveLength(9);
  userEvent.selectOptions(screen.getByRole(selectOptionRoleName), "mon");
});
it("renders table and form", async () => {
  render(<App baseURI={baseURI} />);
  await screen.findByText("Ofengemüse mit Kartoffeln und Tzatziki");
  await screen.findByLabelText("Essen für Montag");
  await screen.findByLabelText("Essen für Dienstag");
  await screen.findByLabelText("Essen für Mittwoch");
  await screen.findByLabelText("Essen für Donnerstag");
  await screen.findByLabelText("Essen für Freitag");
  await screen.findByLabelText("Essen für Samstag");
  await screen.findByLabelText("Essen für Sonntag");
});
