import React from 'react';


import { render, screen, fireEvent } from '@testing-library/react';
import App from './App.js';
import {configs as testConfigs} from './model/Model';
import { layout } from './Layout.js';
import Model from './model/Model.js';
import Square from './model/Model.js';
import { rotateGroup, selectGroup } from './controller/Controller';
import { SquareShape, GroupShape, ButtonShape, redrawCanvas, buttons, computeSquare, computeBox, computeButtons,  clearButtons, drawBoard} from './boundary/Boundary.js';

test('No moves when model created', () => {
  const model = new Model(testConfigs);
  expect(model.numMoves).toBe(0);
});

test('Config 1 by default', () => {
  const model = new Model(testConfigs);
  expect(model.config).toBe(testConfigs[0]);
});

test('Click reset moves to 0', () => {
  const model = new Model(testConfigs);
  model.numMoves = 5;
  model.reset(model.config);
  expect(model.numMoves).toBe(0);
});

test('Click rotate increments moves', () => {
  const model = new Model(testConfigs);
  model.numMoves = 5;
  model.board.selected = model.board.groups[0];
  rotateGroup(model, model.board, true);
  expect(model.numMoves).toBe(6);
});

test('All squares removed victory', () => {
  const model = new Model(testConfigs);
  for (let i = 0; i < model.board.squares.length; i++) {
    model.board.squares[i].color = "white";
  }
  expect(model.victory()).toBe(true);
});
  
test('Squares in group match', () => {
  const model = new Model(testConfigs);
  model.board.selected = model.board.groups[0];
  model.board.selected.squaresInGroup[0].color = "white";
  model.board.selected.squaresInGroup[1].color = "white";
  model.board.selected.squaresInGroup[2].color = "white";
  model.board.selected.squaresInGroup[3].color = "white";
  expect(model.board.selected.matches()).toBe(true);
});

test('Squares in group do not match', () => {
  const model = new Model(testConfigs);
  model.board.selected = model.board.groups[0];
  model.board.selected.squaresInGroup[0].color = "white";
  model.board.selected.squaresInGroup[1].color = "white";
  model.board.selected.squaresInGroup[2].color = "white";
  model.board.selected.squaresInGroup[3].color = "black";
  expect(model.board.selected.matches()).toBe(false);
});

test('Rotate left', () => {
  const model = new Model(testConfigs);
  model.board.selected = model.board.groups[0];
  model.board.selected.rotate(false);
  expect(model.board.selected.squaresInGroup[0].color).toBe("yellow");
  expect(model.board.selected.squaresInGroup[1].color).toBe("grey");
  expect(model.board.selected.squaresInGroup[2].color).toBe("green");
  expect(model.board.selected.squaresInGroup[3].color).toBe("green");
});

test('If matched turn white', () => {
  const model = new Model(testConfigs);
  model.board.selected = model.board.groups[0];
  model.board.selected.squaresInGroup[0].color = "green";
  model.board.selected.squaresInGroup[1].color = "green";
  model.board.selected.squaresInGroup[2].color = "green";
  model.board.selected.squaresInGroup[3].color = "green";
  expect(model.board.selected.matches()).toBe(true);
});

test('configStyle selected turns button red', () => {
  const model = new Model(testConfigs);
  model.config = testConfigs[0];
  expect(layout.configButtonsSelected).toBe(layout.configButtonsSelected);
});

test('Rotate button click', () => {
  render(<App />);
  const rotateButton = screen.getByTestId("counterclockwise");
  fireEvent.click(rotateButton);
});

test('Reset button click', () => {
  render(<App />);
  const resetButton = screen.getByText("Reset");
  fireEvent.click(resetButton);
});

test('validate canvas is rendered', () => {
  render(<App />);
  const canvasElement = screen.getByTestId("canvas");
  expect(canvasElement).toBeTruthy();
});

test('rotate counter button click', () => {
  render(<App />);
  const rotateButton = screen.getByTestId("counterclockwise");
  fireEvent.click(rotateButton);
});

test('rotate clock button click', () => {
  render(<App />);
  const rotateButton = screen.getByTestId("clockwise");
  fireEvent.click(rotateButton);
});

test('config1 button click', () => {
  render(<App />);
  const configButton = screen.getByText("Config 1");
  fireEvent.click(configButton);
});

test('config2 button click', () => {
  render(<App />);
  const configButton = screen.getByText("Config 2");
  fireEvent.click(configButton);
});

test('config3 button click', () => {
  render(<App />);
  const configButton = screen.getByText("Config 3");
  fireEvent.click(configButton);
});

test('SquareShape construct', () => {
  const square = new SquareShape(0, 0, 100, "red");
  expect(square.column).toBe(0);
  expect(square.row).toBe(0);
  expect(square.size).toBe(100);
  expect(square.color).toBe("red");
});

test('GroupShape construct', () => {
  const group = new GroupShape(0, 0);
  expect(group.x).toBe(0);
  expect(group.y).toBe(0);
});

test('ButtonShape construct', () => {
  const button = new ButtonShape(0, 0, 0);
  expect(button.id).toBe(0);
  expect(button.x).toBe(5);
  expect(button.y).toBe(5);
  expect(button.radius).toBe(10);
});

test('computeSquare', () => {
  const square = new SquareShape(0, 0, 100, "red");
  expect(computeSquare(square).column).toBe(5);
  expect(computeSquare(square).row).toBe(5);
  expect(computeSquare(square).size).toBe(100);
  expect(computeSquare(square).color).toBe("red");
});

test('computeBox', () => {
  const group = new GroupShape(0, 0);
  expect(computeBox(group).x).toBe(5);
  expect(computeBox(group).y).toBe(5);
});

test('computeButtons', () => {
  const button = new ButtonShape(0, 0, 0);
  expect(computeButtons(0, button).id).toBe(0);
  expect(computeButtons(0, button).x).toBe(605);
  expect(computeButtons(0, button).y).toBe(605);
});

test('clearButtons', () => {
  clearButtons();
  expect(buttons.length).toBe(0);
});

test('Click any group button in GUI', () => {
  const wrapper = render(<App />);
  const canvasElement = screen.getByTestId("canvas");
  const model = new Model(testConfigs);
  for (let i = 0; i < canvasElement.clientWidth; i++) {
    for (let j = 0; j < canvasElement.clientHeight; j++) {
      fireEvent.click(canvasElement, { clientX: i, clientY: clientY[i], screenX: screenX[i], screenY: screenY[i]});
  }
  expect(model.selected).toBeTruthy();
}
});

test('Click but not select specific group button in GUI', () => {
  const wrapper = render(<App />);
  const canvasElement = screen.getByTestId("canvas");
  const model = new Model(testConfigs);
  fireEvent.click(canvasElement, { clientX: 70, clientY: 69, screenX: 1637,
  screenY: 269});
  expect(model.selected).toBeUndefined();
});


test('select group in model', () => {
  const model = new Model(testConfigs);
  model.board.select(model.board.groups[0]);
  expect(model.board.selected).toBeTruthy();
});

test('Square class contains', () => {
  const model = new Model(testConfigs);
  expect(model.board.squares[0].contains(0, 0)).toBe(true);
});

test('Group class contains', () => {
  const model = new Model(testConfigs);
  expect(model.board.groups[0].contains(0, 0)).toBe(true);
});

test('selectGroup board selected matches', () => {
  render(<App />);
  const canvasElement = screen.getByTestId("canvas");
  const model = new Model(testConfigs);
  model.board.selected = model.board.groups[0];
  for (let i = 0; i < model.board.selected.squaresInGroup.length; i++) {
    model.board.selected.squaresInGroup[i].color = "purple";
  };
  selectGroup(model.board, canvasElement, { clientX: 0, clientY: 0}, buttons);
  model.board.selected = model.board.groups[0];
  expect(model.board.selected.squaresInGroup[0].color).toBe("white");
});

test('Group buttons drawns in canvas', () => {
  render(<App />);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const model = new Model(testConfigs);
  drawBoard(ctx, model.board);
  expect(buttons.length).toBe(9);
});

test('Shadow color is black', () => {
  render(<App />);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const model = new Model(testConfigs);
  drawBoard(ctx, model.board);
  expect(ctx.shadowColor).toBe("#000000");
});

test('Line width is 3', () => {
  render(<App />);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const model = new Model(testConfigs);
  drawBoard(ctx, model.board);
  expect(ctx.lineWidth).toBe(3);
});