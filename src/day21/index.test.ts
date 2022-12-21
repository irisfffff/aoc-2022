import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 21", () => {
  it("Example 1", () => {
    const data = [
      'root: pppw + sjmn', 'dbpl: 5',
      'cczh: sllz + lgvd', 'zczc: 2',
      'ptdq: humn - dvpt', 'dvpt: 3',
      'lfqf: 4',           'humn: 5',
      'ljgn: 2',           'sjmn: drzm * dbpl',
      'sllz: 4',           'pppw: cczh / lfqf',
      'lgvd: ljgn * ptdq', 'drzm: hmdt - zczc',
      'hmdt: 32'
    ];
    expect(solution(data)).toEqual(expect.arrayContaining([152, 301]));
  });
});