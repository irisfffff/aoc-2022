import { readByLine, sumArray } from "../utils";

type Shapes1 = "A" | "B" | "C";
type Shapes2 = "X" | "Y" | "Z";

const shapeMap = {
  X: 1,
  Y: 2,
  Z: 3,
};

const outcomeMap = {
  A: {
    X: 3,
    Y: 6,
    Z: 0,
  },
  B: {
    X: 0,
    Y: 3,
    Z: 6,
  },
  C: {
    X: 6,
    Y: 0,
    Z: 3,
  },
};

const scoreMap = {
  X: 0,
  Y: 3,
  Z: 6,
};

const optionMap = {
  A: {
    X: "Z" as Shapes2,
    Y: "X" as Shapes2,
    Z: "Y" as Shapes2,
  },
  B: {
    X: "X" as Shapes2,
    Y: "Y" as Shapes2,
    Z: "Z" as Shapes2,
  },
  C: {
    X: "Y" as Shapes2,
    Y: "Z" as Shapes2,
    Z: "X" as Shapes2,
  },
};

const parseData = (data: string[]): Array<[Shapes1, Shapes2]> => {
  return data.map((line) => line.split(" ") as [Shapes1, Shapes2]);
};

export const solution = (data: string[]) => {
  const parsedData = parseData(data);

  const scores1 = parsedData.map(([a, b]) => shapeMap[b] + outcomeMap[a][b])
  const res1 = sumArray(scores1);
  console.log(">>> Part 1:", res1);

  const scores2 = parsedData.map(
    ([a, b]) => scoreMap[b] + shapeMap[optionMap[a][b]]
  )
  const res2 = sumArray(scores2);
  console.log(">>> Part 2:", res2);
  return [res1, res2];
};

// Outputs answer, do not change
const data = readByLine("./day02/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
