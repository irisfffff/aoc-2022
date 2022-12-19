import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 18", () => {
  it("Example 1", () => {
    const data = ["1,1,1", "2,1,1"];
    expect(solution(data)).toEqual(expect.arrayContaining([10, 10]));
  });

  it("Example 2", () => {
    const data = [
      '2,2,2', '1,2,2',
      '3,2,2', '2,1,2',
      '2,3,2', '2,2,1',
      '2,2,3', '2,2,4',
      '2,2,6', '1,2,5',
      '3,2,5', '2,1,5',
      '2,3,5'
    ];
    expect(solution(data)).toEqual(expect.arrayContaining([64, 58]));
  });
});