import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Template", () => {
  it("Example 1", () => {
    const data = [
      '....#..',
      '..###.#',
      '#...#.#',
      '.#...##',
      '#.###..',
      '##.#.##',
      '.#..#..'
    ];
    expect(solution(data)).toEqual(expect.arrayContaining([110, 20]));
  });
});