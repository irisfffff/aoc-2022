import { sumArray, multiplyArray } from "./utils";

test('adds array [2, 3, 4] to equal 9', () => {
  expect(sumArray([2, 3, 4])).toBe(9);
});

test('multiplies array [2, 3, 4] to equal 24', () => {
  expect(multiplyArray([2, 3, 4])).toBe(24);
});