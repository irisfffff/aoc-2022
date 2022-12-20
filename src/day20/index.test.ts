import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 20", () => {
  it("Example 1", () => {
    const data = [
      '1', '2',  '-3',
      '3', '-2', '0',
      '4'
    ];
    expect(solution(data)).toEqual(expect.arrayContaining([3, 1623178306]));
  });

  it.skip("Example 2", () => {
    const data = ["correct answer 2"];
    expect(solution(data)).toEqual(expect.arrayContaining(["correct answer"]));
  });
});