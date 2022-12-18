import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day17", () => {
  it("Example 1", () => {
    const data = [">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>"];
    expect(solution(data)).toEqual(expect.arrayContaining([3068]));
  });

  it.skip("Example 2", () => {
    const data = ["correct answer 2"];
    expect(solution(data)).toEqual(expect.arrayContaining(["correct answer"]));
  });
});