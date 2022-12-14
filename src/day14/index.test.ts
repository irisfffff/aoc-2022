import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 14", () => {
  it.skip("Example 1", () => {
    const data = [ '498,4 -> 498,6 -> 496,6', '503,4 -> 502,4 -> 502,9 -> 494,9' ];
    expect(solution(data)).toEqual(expect.arrayContaining([24]));
  });

  it("Example 2", () => {
    const data = [ '498,4 -> 498,6 -> 496,6', '503,4 -> 502,4 -> 502,9 -> 494,9' ];
    expect(solution(data)).toEqual(expect.arrayContaining([93]));
  });
});