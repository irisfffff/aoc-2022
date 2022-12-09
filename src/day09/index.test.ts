import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 9", () => {
  it("Example 1", () => {
    const data = ["R 4", "U 4", "L 3", "D 1", "R 4", "D 1", "L 5", "R 2"];
    expect(solution(data)).toEqual(expect.arrayContaining([13, 1]));
  });

  it("Example 2", () => {
    const data = ["R 5", "U 8", "L 8", "D 3", "R 17", "D 10", "L 25", "U 20"];
    expect(solution(data)).toEqual(expect.arrayContaining([36]));
  });
});
