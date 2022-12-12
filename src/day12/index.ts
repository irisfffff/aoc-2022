import { readByLine } from "../utils";

const parseData = (data: string[]) => {
  let start = [0, 0],
    end = [0, 0];
  const map = data.map((row, i) => {
    return row.split("").map((val, j) => {
      switch (val) {
        case "S":
          start = [i, j];
          return 1;
        case "E":
          end = [i, j];
          return 26;
        default:
          return val.charCodeAt(0) - 96;
      }
    });
  });
  return {
    map,
    start,
    end,
  };
};

const bfs = (
  map: number[][],
  start: [number, number],
  end: [number, number]
) => {
  const length = map.length;
  const width = map[0].length;
  const visited = new Array(length)
    .fill(0)
    .map(() => new Array(width).fill(false));
  let q = new Array<{loc: [number, number], steps: number}>();

  visited[start[0]][start[1]] = true;

  q.push({loc: start, steps: 0});

  while (q.length) {
    const node = q.shift();
    if (!node) return;
    const {loc, steps} = node
    for (const adj of [
      [loc[0], loc[1] + 1],
      [loc[0] + 1, loc[1]],
      [loc[0], loc[1] - 1],
      [loc[0] - 1, loc[1]],
    ]) {
      if (
        adj[0] < 0 ||
        adj[0] >= length ||
        adj[1] < 0 ||
        adj[1] >= width ||
        visited[adj[0]][adj[1]] ||
        map[adj[0]][adj[1]] > map[loc[0]][loc[1]] + 1
      )
        continue;
      visited[adj[0]][adj[1]] = true;
      if(adj[0] === end[0] && adj[1] === end[1])
        return steps + 1
      q.push({loc: adj as [number, number], steps: steps + 1});
    }
  }

  return -1
};

const bfsTopDown = (
  map: number[][],
  start: [number, number]
) => {
  const length = map.length;
  const width = map[0].length;
  const visited = new Array(length)
    .fill(0)
    .map(() => new Array(width).fill(false));
  let q = new Array<{loc: [number, number], steps: number}>();

  visited[start[0]][start[1]] = true;

  q.push({loc: start, steps: 0});

  while (q.length) {
    const node = q.shift();
    if (!node) return;
    const {loc, steps} = node
    for (const adj of [
      [loc[0], loc[1] + 1],
      [loc[0] + 1, loc[1]],
      [loc[0], loc[1] - 1],
      [loc[0] - 1, loc[1]],
    ]) {
      if (
        adj[0] < 0 ||
        adj[0] >= length ||
        adj[1] < 0 ||
        adj[1] >= width ||
        visited[adj[0]][adj[1]] ||
        map[loc[0]][loc[1]] > map[adj[0]][adj[1]] + 1
      )
        continue;
      visited[adj[0]][adj[1]] = true;
      if(map[adj[0]][adj[1]] === 1) {
        return steps + 1
      }
      q.push({loc: adj as [number, number], steps: steps + 1});
    }
  }
  return -1
};

export const solution = (data: string[]) => {
  const {map, start, end} = parseData(data);

  const res1 = bfs(map, start as [number, number], end as [number, number]);
  console.log(">>> Part 1:", res1);

  const res2 = bfsTopDown(map, end as [number, number])
  console.log('>>> Part 2:', res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day12/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
