import { readByLine } from "../utils";

// x: 250-749; y: 0-164
const dx = 250;

const parseData = (data: string[]) => {
  // [x][y]
  const graph = new Array(500).fill(".").map((i) => new Array(165).fill("."));
  let minX = dx,
    maxX = 0,
    minY = 164,
    maxY = 0;
  data.forEach((line) => {
    const path = line.split(" -> ").map((coords) => {
      const match = coords.match(/\d+/g);
      if (!match) return [0, 0];
      const x = parseInt(match[0]) - dx;
      const y = parseInt(match[1]);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      return [x, y];
    });
    for (let i = 0; i < path.length - 1; i++) {
      const [x1, y1] = path[i];
      const [x2, y2] = path[i + 1];
      if (x1 === x2) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
          graph[x1][y] = "#";
        }
      }
      if (y1 === y2) {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
          graph[x][y1] = "#";
        }
      }
    }
  });
  graph[500 - dx][0] = "+";
  return { graph, minX, maxX, minY, maxY };
};

const pourSand = (
  graph: string[][],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  // Source of sand 500,0
  const sourceX =  500 - dx,
    sourceY = 0;
  let rest = 0;
  while (true) {
    let x = sourceX,
      y = sourceY;
    while (true) {
      const blockY = graph[x]
        .slice()
        .findIndex((grid, i) => i > y && (grid === "#" || grid === "o"));
      if (graph[x - 1][blockY] === ".") {
        x = x - 1;
        y = blockY;
      } else if (graph[x + 1][blockY] === ".") {
        x = x + 1;
        y = blockY;
      } else {
        graph[x][blockY - 1] = "o";
        rest++;
        break;
      }
      if (x < minX || x > maxX) {
        return rest;
      }
    }
  }
};

const pourSand2 = (
  graph: string[][],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  for (let i = 0; i < graph.length; i++) {
    graph[i][maxY + 2] = "#";
  }

  // Source of sand 500,0
  const sourceX = 500 - dx,
    sourceY = 0;
  let rest = 0;
  while (true) {
    let x = sourceX,
      y = sourceY;
    while (true) {
      const blockY = graph[x]
        .slice()
        .findIndex((grid, i) => i > y && (grid === "#" || grid === "o"));
      if (graph[x - 1][blockY] === ".") {
        x = x - 1;
        y = blockY;
      } else if (graph[x + 1][blockY] === ".") {
        x = x + 1;
        y = blockY;
      } else {
        graph[x][blockY - 1] = "o";
        rest++;
        if (x === sourceX && blockY - 1 === sourceY) {
          return rest
        }
        break;
      }
    }
  }
};

export const solution = (data: string[]) => {
  const { graph, minX, maxX, minY, maxY } = parseData(data);

  // const res1 = pourSand(graph, minX, maxX, minY, maxY);
  // console.log(">>> Part 1:", res1);

  const res2 = pourSand2(graph, minX, maxX, minY, maxY);
  console.log(">>> Part 2:", res2);
  return [
    // res1,
    res2,
  ];
};

const data = readByLine("./day14/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
