import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders loading", () => {
  render(<App />);
  const loadingElement =
    screen.getByText(/現実から醒めると、不思議な花園にいた……/);
  expect(loadingElement).toBeInTheDocument();
});
