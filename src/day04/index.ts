import { readByLine, sumArray } from "../utils";

const parseData = (data: string[]) => {
  return data.map((line) => {
    const pair = line.split(",");
    return pair.map(range => range.split("-").map((i) => parseInt(i))).flat()
  });
};

const isFullyOverlap = (pair: number[]) => {
  const [a, b, c, d] = pair
  return ((a >= c && b <= d) || (a <= c && b >= d)) ? 1 : 0
}

const isOverlap = (pair: number[]) => {
  const [a, b, c, d] = pair
  return (b < c || a > d) ? 0 : 1
}

export const solution = (data: string[]) => {
  const parsedData = parseData(data);

  const res1 = sumArray(parsedData.map(pair => isFullyOverlap(pair)));
  console.log(">>> Part 1:", res1);

  const res2 = sumArray(parsedData.map(pair => isOverlap(pair)));
  console.log('>>> Part 2:', res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day04/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
