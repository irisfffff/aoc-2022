import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 2", () => {
  it("Example 1", () => {
    const data = ["A Y", "B X", "C Z"];
    expect(solution(data)).toEqual(expect.arrayContaining([15, 12]));
  });
});
