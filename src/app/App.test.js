import { cleanup } from "@testing-library/react";

export const mealPlanController = require("../meals/index.js").getMealPlan();
const testServer = require("../testServer");
const port = 8002;
export const baseURI = `http://localhost:${port}`;
beforeAll(async () => {
  testServer.start(port);
});

afterEach(() => {
  cleanup();
});
afterAll(async () => {
  await testServer.stop();
});

require("./AppIntegrationTests");
require("./components/mealsTableComponentTests");
require("./components/mealPlannerComponentTests");
