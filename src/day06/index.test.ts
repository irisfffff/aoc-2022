import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 6", () => {
  it("Example 1", () => {
    const data = ["mjqjpqmgbljsphdztnvjfqwrcgsmlb"];
    expect(solution(data)).toEqual(expect.arrayContaining([7, 19]));
  });

  it("Example 2", () => {
    const data = ["bvwbjplbgvbhsrlpgdmjqwftvncz"];
    expect(solution(data)).toEqual(expect.arrayContaining([5, 23]));
  });

  it("Example 3", () => {
    const data = ["nppdvjthqldpwncqszvftbrmjlhg"];
    expect(solution(data)).toEqual(expect.arrayContaining([6, 23]));
  });

  it("Example 4", () => {
    const data = ["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"];
    expect(solution(data)).toEqual(expect.arrayContaining([10, 29]));
  });


  it("Example 5", () => {
    const data = ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"];
    expect(solution(data)).toEqual(expect.arrayContaining([11, 26]));
  });
});