import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 13", () => {
  it("Example 1", () => {
    const data =[
      '[1,1,3,1,1]',
      '[1,1,5,1,1]',
      '',
      '[[1],[2,3,4]]',
      '[[1],4]',
      '',
      '[9]',
      '[[8,7,6]]',
      '',
      '[[4,4],4,4]',
      '[[4,4],4,4,4]',
      '',
      '[7,7,7,7]',
      '[7,7,7]',
      '',
      '[]',
      '[3]',
      '',
      '[[[]]]',
      '[[]]',
      '',
      '[1,[2,[3,[4,[5,6,7]]]],8,9]',
      '[1,[2,[3,[4,[5,6,0]]]],8,9]'
    ];
    expect(solution(data)).toEqual(expect.arrayContaining([13, 140]));
  });
});