import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 12", () => {
  it("Example 1", () => {
    const data = ["Sabqponm", "abcryxxl", "accszExk", "acctuvwj", "abdefghi"];
    expect(solution(data)).toEqual(expect.arrayContaining([31, 29]));
  });
});
