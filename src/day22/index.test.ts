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
      '        ...#',     '        .#..',
      '        #...',     '        ....',
      '...#.......#',     '........#...',
      '..#....#....',     '..........#.',
      '        ...#....', '        .....#..',
      '        .#......', '        ......#.',
      '',                 '10R5L5R10L4R5L5'
    ];
    expect(solution(data)).toEqual(expect.arrayContaining([6032]));
  });

  it.skip("Example 2", () => {
    const data = ["correct answer 2"];
    expect(solution(data)).toEqual(expect.arrayContaining(["correct answer"]));
  });
});