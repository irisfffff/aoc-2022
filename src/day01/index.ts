import { readByLine, sumArray, quickSortRecursive } from "../utils";

const parseData = (data: string[]) => {
  const elves: Array<number[]> = [];
  let cur: number[] = [];
  data.forEach((item) => {
    if (item) {
      cur.push(parseInt(item));
    } else {
      elves.push(cur);
      cur = [];
    }
  });
  elves.push(cur)
  return elves;
};

export const solution = (data: string[]) => {
  const elves = parseData(data);
  const elvesTotalCal = elves.map(elv => sumArray(elv))
  const res1 = Math.max(...elvesTotalCal)
  console.log('>>> Part 1:', res1);

  quickSortRecursive(elvesTotalCal, 0, elvesTotalCal.length-1)
  const res2 = sumArray(elvesTotalCal.slice(-3))
  console.log('>>> Part 2:', res2)
  return res2
};

// Outputs answer, do not change
const data = readByLine("./data");
solution(data);
