import { solution } from ".";
import { readFileSync } from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn((file_name) => {
    return [];
  }),
}));

describe("Day 1", () => {
  it("Example 1", () => {
    const data = [
      '1000', '2000',  '3000',
      '',     '4000',  '',
      '5000', '6000',  '',
      '7000', '8000',  '9000',
      '',     '10000'
    ];
    expect(solution(data)).toBe(45000);
  });
});
