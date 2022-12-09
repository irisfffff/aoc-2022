import { readByLine } from "../utils";

type Loc = {
  x: number;
  y: number;
};

type Motion = [string, number];

const parseData = (data: string[]): Motion[] => {
  return data.map((line) => {
    const [dir, dis] = line.split(" ");
    return [dir, parseInt(dis)];
  });
};

const moveTail = (head: Loc, tail: Loc) => {
  if (Math.abs(head.x - tail.x) > 1) {
    if (head.x > tail.x) {
      tail.x += 1;
    } else {
      tail.x -= 1;
    }
    if (head.y > tail.y) {
      tail.y += 1;
    } else if (head.y < tail.y) {
      tail.y -= 1;
    }
  }
  if (Math.abs(head.y - tail.y) > 1) {
    if (head.y > tail.y) {
      tail.y += 1;
    } else {
      tail.y -= 1;
    }
    if (head.x > tail.x) {
      tail.x += 1;
    } else if (head.x < tail.x) {
      tail.x -= 1;
    }
  }
};

const moveHead = (head: Loc, dir: string) => {
  switch (dir) {
    case "R":
      head.x += 1;
      break;
    case "U":
      head.y += 1;
      break;
    case "L":
      head.x -= 1;
      break;
    case "D":
      head.y -= 1;
      break;
    default:
      break;
  }
};

const followMotions = (motions: Motion[], knotAmount: number) => {
  const knots: Loc[] = new Array(knotAmount)
    .fill(0)
    .map((i) => ({ x: 0, y: 0 }));
  const visited = new Set();
  visited.add("0, 0");
  for (let [dir, dis] of motions) {
    while (dis) {
      moveHead(knots[0], dir);
      for (let i = 1; i < knotAmount; i++) {
        moveTail(knots[i - 1], knots[i]);
      }
      // Record location
      visited.add(`${knots[knotAmount - 1].x}, ${knots[knotAmount - 1].y}`);
      dis--;
    }
  }
  return visited;
};

export const solution = (data: string[]) => {
  const parsedData = parseData(data);

  const res1 = followMotions(parsedData, 2).size;
  console.log(">>> Part 1:", res1);

  const res2 = followMotions(parsedData, 10).size;
  console.log(">>> Part 2:", res2);
  return [res1, res2];
};

const data = readByLine("./day09/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
