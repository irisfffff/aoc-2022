import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 8", () => {
  it("Example 1", () => {
    const data = [ '30373', '25512', '65332', '33549', '35390' ];
    expect(solution(data)).toEqual(expect.arrayContaining([21, 8]));
  });
});